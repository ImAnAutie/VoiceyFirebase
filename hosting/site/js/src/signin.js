import { loadPage } from './load'

function getProvider(providerId) {
  switch (providerId) {
    case firebase.auth.GoogleAuthProvider.PROVIDER_ID:
      return new firebase.auth.GoogleAuthProvider();
    case firebase.auth.FacebookAuthProvider.PROVIDER_ID:
      return new firebase.auth.FacebookAuthProvider();
    case firebase.auth.GithubAuthProvider.PROVIDER_ID:
      return new firebase.auth.GithubAuthProvider();
    default:
      throw new Error(`No provider implemented for ${providerId}`);
  }
}

const signinPageLoad = async function (params) {
  console.log('Adding sign in page onclicks')

  try {
    const redirectResult = await window.auth.getRedirectResult()
    console.log('Got redirect result')
    console.log(redirectResult)
    if (redirectResult && redirectResult.user) {
      window.router.navigate(
        window.router.generate('homepage')
      )
    };
  } catch (error) {
    console.log('Failed getting redirect result')
    console.log(error)
    switch (error.code) {
      case "auth/account-exists-with-different-credential":
        const supportedMethods = [
          firebase.auth.GoogleAuthProvider.PROVIDER_ID,
          firebase.auth.FacebookAuthProvider.PROVIDER_ID
        ];
        const emailMethods = await window.auth.fetchSignInMethodsForEmail(error.email);
        const firstMethod = emailMethods.find(p => supportedMethods.includes(p));
        if (!firstMethod) {
          return window.alert(`Please use your: ${emailMethods[0]} to sign in`);
        }
        const linkedProvider = getProvider(firstMethod);
        linkedProvider.setCustomParameters({ login_hint: error.email });
        window.auth.signInWithRedirect(linkedProvider)
        break;
      default:
        window.alert(error.code);
    }
  }

  $('#signinWithGoogleButton').on('click', function () {
    console.log('sign in with google clicked')
    const provider = new window.firebase.auth.GoogleAuthProvider()
    window.auth.signInWithRedirect(provider)
  })
  $('#signinWithFacebookButton').on('click', function () {
    console.log('sign in with Facebook clicked')
    const provider = new window.firebase.auth.FacebookAuthProvider()
    window.auth.signInWithRedirect(provider)
  })
}

const routes = {
  '/signin': {
    as: 'authentication.signin',
    uses: function (params) {
      console.log('I am on the signin')
      console.log(params)
      loadPage('signin', params)
    }
  }
}

export { signinPageLoad, routes as signinRoutes }
