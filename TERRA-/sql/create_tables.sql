CREATE OR REPLACE TABLE
`clitech-503307.soil_project1.infused_vectors`
AS

SELECT

    a.*,

    h.OC_D1,
    h.TOTN_D1,
    h.BULK_D1,
    h.SAND_D1,
    h.SILT_D1,
    h.CLAY_D1

FROM
`clitech-503307.soil_project1.alpha_embeddings` AS a

INNER JOIN
`clitech-503307.soil_project1.hwsd_extracted` AS h

ON a.cell_id = h.cell_id;
