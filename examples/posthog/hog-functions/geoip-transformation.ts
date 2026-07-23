// A transformation runs inline on the ingestion pipeline, enriching every event
// before it lands. This one is the stock GeoIP transformation — no inputs, no
// secrets — enabled for the whole project. Transformations of the same type run
// in the order they're created.
import { hogFunction } from "@posthog/definitions";

export default hogFunction({
  key: "geoip",
  type: "transformation",
  name: "GeoIP enrichment",
  description: "Adds city / country properties to every event from the client IP.",
  templateId: "template-geoip",
  enabled: true,
});
