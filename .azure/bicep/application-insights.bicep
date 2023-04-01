@description('Location for all resources')
param location string = resourceGroup().location

var tags = {
  resource: 'blog'
}

resource workspace 'Microsoft.OperationalInsights/workspaces@2022-10-01' = {
  name: 'logBlogApplicationInsightsWorkspace'
  location: location
  properties: {
    sku: {
      name: 'PerGB2018'
    }
    retentionInDays: 30
  }
  tags: tags
}

resource applicationInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: 'appiBlog'
  kind: 'web'
  location: location
  properties: {
    Application_Type: 'web'
    Flow_Type: 'Bluefield'
    IngestionMode: 'LogAnalytics'
    publicNetworkAccessForIngestion: 'Enabled'
    publicNetworkAccessForQuery: 'Enabled'
    Request_Source: 'rest'
    RetentionInDays: 90
    WorkspaceResourceId: workspace.id
  }
  tags: tags
}

output applicationInsightsInstrumentationKey string = applicationInsights.properties.InstrumentationKey
output applicationInsightsConnectionString string = applicationInsights.properties.ConnectionString
