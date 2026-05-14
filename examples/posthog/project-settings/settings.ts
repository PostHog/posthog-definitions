import { projectSettings } from "../../../src/index.js";

// Singleton: there is exactly one project-settings spec per project. Declaring
// it in two files is a load-time error. Fields you don't list here are
// untouched on the server — even if PostHog's UI default differs.
export default projectSettings({
  timezone: "Europe/London",
  week_start_day: 1,
  app_urls: ["https://app.example.com", "https://staging.example.com"],
  recording_domains: ["app.example.com"],
  anonymize_ips: false,

  // Autocapture & web vitals.
  autocapture_opt_out: false,
  autocapture_exceptions_opt_in: true,
  autocapture_web_vitals_opt_in: true,
  capture_dead_clicks: true,
  capture_console_log_opt_in: false,
  capture_performance_opt_in: true,

  // Session recording.
  session_recording_opt_in: true,
  session_recording_sample_rate: "0.10",
  session_recording_minimum_duration_milliseconds: 2000,
  session_recording_retention_period: "30d",

  // Heatmaps & surveys.
  heatmaps_opt_in: true,
  surveys_opt_in: false,
});
