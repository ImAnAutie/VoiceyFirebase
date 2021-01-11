import { config } from './config'
import { loadPage, load404 } from './load'
import { signinRoutes } from './signin'
import { fetchUserBoards, boardRoutes } from './boards'
window.fetchUserBoards = fetchUserBoards;

const firebase = require('firebase/app').default
window.firebase = firebase
const Navigo = require('navigo')
const Template7 = require('template7').default
window.Template7 = Template7
Template7.global = {
  app: {
    name: 'Voicey'
  },
  user: null
}
require('firebase/auth')
require('firebase/firestore')
require('firebase/storage')
const $ = require('jquery')
window.$ = $

const init = async () => {
  console.log(`I am running on version: ${config('version')}`)

  console.table(config())

  // fetch firebase configuration json
  const response = await window.fetch('/__/firebase/init.json')
  const firebaseConfig = await response.json()
  firebaseConfig.authDomain = window.location.hostname
  console.table(firebaseConfig)

  try {
    // initialize firebase
    firebase.initializeApp(firebaseConfig)
  } catch (error) {
    window.alert(error)
  }
  window.db = firebase.firestore()
  $('body').trigger('dbLoaded')

  window.storage = firebase.storage()
  $('body').trigger('storageLoaded')

  window.auth = firebase.auth()
  $('body').trigger('authLoaded')

  // when a user signs in, out or is first seen this session in either state
  window.auth.onAuthStateChanged(function (user) {
    if (user) {
      console.log(`User: ${user.uid} is signed in`)
      Template7.global.user = user
      window.fetchUserBoards();
    } else {
      console.log('Not authenticated')
      Template7.global.user = null
      Template7.global.userBoards = null;
    }
    window.renderTemplates()
  })

  const root = `https://${window.location.href.split('/')[2]}/`
  const useHash = false
  const hash = '#!' // Defaults to: '#'
  const router = new Navigo(root, useHash, hash)
  window.router = router

  const routes = {
    '/': {
      as: 'homepage',
      uses: function (params) {
        console.log('I am on the homepage')
        console.log(params)
        loadPage('index', params)
      }
    }
  }
  Object.assign(routes, signinRoutes)
  Object.assign(routes, boardRoutes);
  router.on(routes)

  router.notFound(function () {
    console.log('Route not found')
    load404()
  })

  $(document).ready(function () {
    $('.defaultFragmentHolder').each(function () {
      const fragment = $(this).data('fragmentid')
      window.loadFragment(fragment)
    })

    router.resolve()
  })
}

init()
