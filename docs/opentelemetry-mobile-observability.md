# Privacy-conscious OpenTelemetry in a React Native health companion

Status: production adoption note, 2 August 2026

[Juno](https://junocompanion.com/?utm_source=github&utm_medium=referral&utm_campaign=otel-adopters) is an AI health companion for people living with chronic illness. Its mobile app uses OpenTelemetry to understand reliability and performance without treating conversation or symptom content as observability data.

This note describes the implementation boundary and the lessons that are reusable in other React Native applications. It is not a clinical-outcomes report, a compliance certification, or an endorsement by the OpenTelemetry project.

## What Juno uses

The Expo and React Native client uses the OpenTelemetry JavaScript packages for three signals:

- traces through `WebTracerProvider` and `BatchSpanProcessor`;
- metrics through `MeterProvider` and `PeriodicExportingMetricReader`;
- structured logs through `LoggerProvider` and `BatchLogRecordProcessor`.

All three signals use the standard OTLP/HTTP exporters. The app identifies telemetry with bounded resource attributes such as service version, platform, runtime version, update identifier, and production or development environment.

Juno currently instruments operational paths including:

- application-launch milestones and stalled launch stages;
- text-chat request, queue, retry, and first-render latency;
- voice-call starts and selected lifecycle events;
- frame drops, JavaScript thread lag, and time to first display;
- sanitized error counts and structured diagnostic events.

The implementation uses the JavaScript component directly. Juno does not provide an OpenTelemetry-related library or observability service.

## The privacy boundary

Health applications need a stricter boundary than simply avoiding obvious field names. Juno applies these rules before export:

1. **Application content is not telemetry.** Attribute keys associated with symptoms, prompts, notes, message bodies, responses, tokens, or similar content are rejected by a shared sensitive-key filter.
2. **Metric content is bounded, but cardinality still needs review.** Counters and histograms receive operational attributes after the same content filter, so conversation and symptom text are not metric dimensions. The current shared cleaner also appends an opaque application account identifier to measurements. That supports incident correlation, but it increases cardinality and is a known limitation rather than a recommended metric pattern.
3. **Identifiers remain separate from health content.** The exported identifier is an opaque application account ID used for support correlation. Names, email addresses, phone numbers, conversation text, symptom text, and medication text are not attached as telemetry attributes.
4. **Resource data is operational.** Release, build, platform, runtime, and update metadata are useful for finding regressions without collecting what a person wrote in the app.
5. **Export can be disabled centrally.** A dedicated QA mode prevents external observability traffic, and the OpenTelemetry pipeline can also be disabled through configuration.
6. **Diagnostics must not change product behaviour.** Export is best-effort, batched, timeout-bounded, and isolated so an unavailable collector or intake cannot block a user-facing action.

The sensitive-key policy is shared with the app's other diagnostic pipeline. Keeping one policy avoids a common failure mode in which two telemetry systems silently disagree about what is safe to export.

## A small initialization pattern

The production implementation is larger, but its shape is deliberately conventional:

```ts
const resource = resourceFromAttributes({
  "service.name": "mobile-app",
  "service.version": appVersion,
  "deployment.environment.name": environment,
  "device.platform": Platform.OS,
});

const tracerProvider = new WebTracerProvider({
  resource,
  spanProcessors: [
    new BatchSpanProcessor(new OTLPTraceExporter({
      url: `${otlpEndpoint}/v1/traces`,
      headers: otlpHeaders,
      timeoutMillis: 8_000,
    })),
  ],
});

tracerProvider.register();

const meterProvider = new MeterProvider({
  resource,
  readers: [
    new PeriodicExportingMetricReader({
      exporter: new OTLPMetricExporter({
        url: `${otlpEndpoint}/v1/metrics`,
        headers: otlpHeaders,
        timeoutMillis: 8_000,
      }),
      exportIntervalMillis: 30_000,
    }),
  ],
});

metrics.setGlobalMeterProvider(meterProvider);
```

Every wrapper that starts a span or records a measurement sanitizes attributes first. Instrumentation code receives only the cleaned map, so a caller cannot bypass the boundary accidentally.

## What this changed for the engineering workflow

Using OpenTelemetry gives the mobile team one vocabulary for traces, metrics, and logs across release versions. It also makes privacy review more concrete: reviewers can inspect a single resource schema, attribute filter, exporter configuration, and list of named instruments instead of inferring behaviour from scattered analytics calls.

The useful result is not “more telemetry.” It is a smaller, explicit set of operational signals that can answer reliability questions without copying sensitive product content into an observability backend. Signal cardinality still requires separate review; content sanitisation does not make an identifier appropriate as a metric dimension.

## Limitations

- This note documents architecture and safeguards; it does not claim that telemetry alone proves privacy, security, regulatory compliance, or clinical effectiveness.
- Client-side controls are one layer. Access controls, retention, incident response, and processor agreements still belong in the wider operational review.
- The current shared attribute cleaner appends an opaque account identifier to spans and measurements. A future production change should separate trace-correlation attributes from low-cardinality metric attributes before telemetry volume grows; this note does not present the current metric identifier as best practice.
- Instrument names and attributes evolve. New telemetry must pass the same content-exclusion and cardinality review before release.

Questions about this adoption note can be raised through the [Juno Open Health Tools issue tracker](https://github.com/MarshallBear1/juno-open-health-tools/issues) or sent to `team@juno-chat.com`.
