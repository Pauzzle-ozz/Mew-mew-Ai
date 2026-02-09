$json = Get-Content "03-test-workflow-creator.json" | ConvertFrom-Json
$cleanJson = @{
    name = $json.name
    nodes = $json.nodes
    connections = $json.connections
    settings = $json.settings
    staticData = $json.staticData
    tags = $json.tags
} | ConvertTo-Json -Depth 100 -Compress

$headers = @{
    "Content-Type" = "application/json"
    "X-N8N-API-KEY" = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhMjliYmI3Yi1kY2Q0LTQzM2YtYWJmNS00YTlkMTNkM2I4ZjkiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzcwMDQ0NjMxfQ.PFadrtlIaw5BgempunKMtiAh9_FH1dnvM-nhej7CilI"
}

$response = Invoke-RestMethod -Uri "http://localhost:5678/api/v1/workflows" -Method POST -Headers $headers -Body $cleanJson
$response | ConvertTo-Json
