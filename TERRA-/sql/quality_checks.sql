SELECT
COUNT(*) AS total_samples
FROM
`clitech-503307.soil_project1.infused_vectors`;

SELECT

COUNTIF(OC_D1 IS NULL) AS missing_soc,

COUNTIF(TOTN_D1 IS NULL) AS missing_nitrogen,

COUNTIF(BULK_D1 IS NULL) AS missing_bulk,

COUNTIF(SAND_D1 IS NULL) AS missing_sand,

COUNTIF(SILT_D1 IS NULL) AS missing_silt,

COUNTIF(CLAY_D1 IS NULL) AS missing_clay

FROM
`clitech-503307.soil_project1.infused_vectors`;

SELECT
COUNT(*) AS invalid_soc

FROM
`clitech-503307.soil_project1.infused_vectors`

WHERE

OC_D1 <= 0;
