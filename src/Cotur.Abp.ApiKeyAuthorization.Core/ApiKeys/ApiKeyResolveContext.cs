namespace Cotur.Abp.ApiKeyAuthorization.Core.ApiKeys;

public class ApiKeyResolveContext : IApiKeyResolveContext
{
    public IServiceProvider ServiceProvider { get; }
    public string ApiKeyValue { get; set; }
    
    public bool HasResolvedApiKey()
    {
        return ApiKeyValue != null;
    }

    public ApiKeyResolveContext(IServiceProvider serviceProvider)
    {
        ServiceProvider = serviceProvider;
    }
}