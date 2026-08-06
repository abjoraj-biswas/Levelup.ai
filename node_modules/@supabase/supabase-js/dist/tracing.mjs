import { n as registerTraceContextExtractor } from "./tracingRegistry.mjs";
import { context, propagation } from "@opentelemetry/api";

//#region ../../shared/tracing/dist/module/create-extractor.js
/**
* Build a {@link TraceContextExtractor} from an OpenTelemetry API object.
*
* The extractor injects the active context into a fresh carrier on every
* call and returns the W3C trace headers found there, or null when there is
* no active trace (no `traceparent`) or the API throws.
*/
function createTraceContextExtractor(otel) {
	return () => {
		try {
			const carrier = {};
			otel.propagation.inject(otel.context.active(), carrier);
			const traceparent = carrier["traceparent"];
			if (!traceparent) return null;
			return {
				traceparent,
				tracestate: carrier["tracestate"],
				baggage: carrier["baggage"]
			};
		} catch (_a) {
			return null;
		}
	};
}

//#endregion
//#region src/tracing.ts
/**
* Opt-in OpenTelemetry runtime for `tracePropagation`.
*
* Importing this module registers the OpenTelemetry trace context extractor
* used by every Supabase client in the process. It has no exports — the
* import itself is the opt-in:
*
* ```ts
* import '@supabase/supabase-js/tracing'
* import { createClient } from '@supabase/supabase-js'
*
* const supabase = createClient(url, key, { tracePropagation: true })
* ```
*
* Requires `@opentelemetry/api` to be installed — this module imports it
* directly, so bundlers include it and resolution fails loudly when it is
* missing. Without this import, enabling `tracePropagation` logs a one-time
* warning and requests are sent without trace headers.
*
* @module tracing
*/
registerTraceContextExtractor(createTraceContextExtractor({
	propagation,
	context
}));

//#endregion
export {  };
//# sourceMappingURL=tracing.mjs.map