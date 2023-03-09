export default defineAppConfig({
  version: '1.0.0',
  name: '4Record',
  api: {
    hello_world: process?.env?.API_HOST || null
  }
})
