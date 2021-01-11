export function config (key) {
  const configStore = {}
  configStore.firebaseDevEnviromentProject = 'okoprojectaac'
  configStore.SiteDefaultTitle = 'Voicey'
  configStore.DevEnviromentFirebaseFunctionsUrl =
    'https://us-central1-okoprojectaac.cloudfunctions.net'
  configStore.version = '{{APP_VERSION_HERE}}'
  configStore.publicUrl = 'voicey.app'

  configStore.firebaseFunctionsUrl =
    'https://us-central1-parkplanr-dev.cloudfunctions.net'

  if (!key) {
    return configStore
  }

  if (configStore[key]) {
    return configStore[key]
  } else {
    throw new Error(`Config key: ${key} unknown`)
  }
}
