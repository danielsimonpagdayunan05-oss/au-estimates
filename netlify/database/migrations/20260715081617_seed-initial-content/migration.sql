-- Seed initial editable content, matching the values the app previously
-- had hardcoded, so the admin panel starts populated with real figures.

INSERT INTO "settings" ("key", "value") VALUES
('company.name', '"Archiunite Design & Construction"'),
('company.shortName', '"Archiunite"'),
('hero.headline', '"Build Your Dream Project with Confidence"'),
('hero.subtitle', '"Instantly estimate your design fee and construction cost using AI-powered calculations — tailored to your province, quality standard, and building program."'),
('hero.tagline', '"Together, let us share and build your story."'),
('hero.sampleEstimate', '{"investment": 12480000, "timelineMonths": 14, "riskLabel": "Low", "riskPct": 28}'),
('estimator.categoryRates', '{"Residential": 32000, "Commercial": 38000, "Office": 40000, "Industrial": 26000, "Institutional": 34000, "Hospital": 55000, "Warehouse": 20000, "Mixed-use": 42000, "Subdivision": 28000, "Others": 30000}'),
('estimator.qualityMultipliers', '{"Basic": 0.75, "Standard": 1.0, "Premium": 1.35, "Luxury": 1.8, "Ultra Luxury": 2.6}'),
('estimator.projectTypeMultipliers', '{"New Construction": 1.0, "Renovation": 0.65, "Extension": 0.8, "Interior Fit-out": 0.55, "Design Only": 0.12, "Design & Build": 1.05}'),
('estimator.mepMultipliers', '{"Simple": 1.0, "Standard": 1.08, "Advanced": 1.2, "Mission-Critical": 1.42}'),
('estimator.architecturalFeeTiers', '[{"upTo": 3000000, "rate": 0.12}, {"upTo": 10000000, "rate": 0.1}, {"upTo": 30000000, "rate": 0.085}, {"upTo": 100000000, "rate": 0.07}, {"upTo": null, "rate": 0.06}]'),
('estimator.engineeringFeeRate', '0.045'),
('estimator.interiorFeeRate', '0.06'),
('estimator.floorsCostAdderPerLevel', '0.03'),
('estimator.qualityTimelineFactors', '{"Basic": 0.85, "Standard": 1.0, "Premium": 1.15, "Luxury": 1.35, "Ultra Luxury": 1.6}'),
('estimator.projectTypeTimelineFactors', '{"New Construction": 1.0, "Renovation": 0.6, "Extension": 0.7, "Interior Fit-out": 0.45, "Design Only": 0.22, "Design & Build": 1.1}');

INSERT INTO "stat_items" ("label", "value", "prefix", "suffix", "sort_order") VALUES
('Projects Estimated', 2400, '', '+', 0),
('Project Value Estimated', 18, '₱', 'B+', 1),
('Client Satisfaction', 98, '', '%', 2),
('Average Estimate Time', 2, '', ' min', 3);

INSERT INTO "provinces" ("name", "region", "multiplier", "cities", "sort_order") VALUES
('Metro Manila', 'NCR', 1.0, '["Quezon City", "Makati", "Taguig", "Manila", "Pasig", "Mandaluyong", "Parañaque"]', 0),
('Cavite', 'Region IV-A', 0.88, '["Bacoor", "Dasmariñas", "Imus", "Tagaytay", "General Trias"]', 1),
('Laguna', 'Region IV-A', 0.89, '["Santa Rosa", "Calamba", "San Pablo", "Biñan"]', 2),
('Batangas', 'Region IV-A', 0.85, '["Batangas City", "Lipa", "Tanauan"]', 3),
('Rizal', 'Region IV-A', 0.9, '["Antipolo", "Cainta", "Taytay"]', 4),
('Bulacan', 'Region III', 0.87, '["Malolos", "Meycauayan", "San Jose del Monte"]', 5),
('Pampanga', 'Region III', 0.86, '["San Fernando", "Angeles City", "Mabalacat"]', 6),
('Cebu', 'Region VII', 0.92, '["Cebu City", "Mandaue", "Lapu-Lapu", "Talisay"]', 7),
('Davao del Sur', 'Region XI', 0.83, '["Davao City", "Digos"]', 8),
('Iloilo', 'Region VI', 0.8, '["Iloilo City", "Oton", "Pavia"]', 9),
('Benguet', 'CAR', 0.94, '["Baguio City", "La Trinidad"]', 10),
('Pangasinan', 'Region I', 0.78, '["Dagupan", "San Carlos", "Urdaneta"]', 11);

INSERT INTO "additional_services" ("id", "label", "category", "fee_type", "value", "sort_order") VALUES
('architectural-design', 'Architectural Design', 'design', 'per_sqm', 250, 0),
('structural-design', 'Structural Design', 'engineering', 'per_sqm', 180, 1),
('electrical-design', 'Electrical Design', 'engineering', 'per_sqm', 90, 2),
('plumbing-design', 'Plumbing Design', 'engineering', 'per_sqm', 70, 3),
('mechanical-design', 'Mechanical Design', 'engineering', 'per_sqm', 110, 4),
('fire-protection', 'Fire Protection', 'engineering', 'per_sqm', 60, 5),
('sanitary', 'Sanitary', 'engineering', 'per_sqm', 50, 6),
('interior-design', 'Interior Design', 'design', 'per_sqm', 300, 7),
('landscape-design', 'Landscape Design', 'design', 'per_sqm', 120, 8),
('permit-processing', 'Permit Processing', 'documentation', 'flat', 85000, 9),
('3d-perspective', '3D Perspective', 'design', 'flat', 25000, 10),
('walkthrough-animation', 'Walkthrough Animation', 'design', 'flat', 65000, 11),
('bill-of-quantities', 'Bill of Quantities', 'documentation', 'flat', 35000, 12),
('project-management', 'Project Management', 'construction', 'percent', 0.05, 13),
('construction-supervision', 'Construction Supervision', 'construction', 'percent', 0.04, 14),
('as-built-plans', 'As-Built Plans', 'documentation', 'flat', 20000, 15),
('bim-modeling', 'BIM Modeling', 'design', 'percent', 0.015, 16),
('drone-survey', 'Drone Survey', 'survey', 'flat', 18000, 17),
('site-inspection', 'Site Inspection', 'survey', 'flat', 12000, 18),
('geotechnical-investigation', 'Geotechnical Investigation', 'survey', 'flat', 45000, 19);
