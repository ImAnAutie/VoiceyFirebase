import { signinPageLoad } from './signin'
import { config } from './config'

function load404 () {
  // TODO: This but better
  $('#contentDiv').html('4 oh 4')
}

const renderTemplates = () => {
  $('template-holder').each(function () {
    const template = $(this).find('template-template').html()
    console.log(template)
    if ($(this).data('rendered') && $(this).data('runonce')) {
      return console.log("Already rendered run once template.")
    }

    const compiledTemplate = window.Template7.compile(template)

    $(this).data('rendered', true).find('template-render').html(compiledTemplate())

    $('.signoutButton').each(function () {
      $(this).on('click', function () {
        console.log('Sign out button clicked')
        window.auth.signOut()
      })
    })
  })
  window.router.updatePageLinks()
}
window.renderTemplates = renderTemplates

const loadFragment = function (fragment) {
  console.log(`Loading fragment: ${fragment}`)
  $.get(`/fragments/${fragment}.html`, function (data) {
    try {
      const isFragment = data.startsWith('<!-- FRAGMENT CONTENT-TAG_ID -->')

      if (!isFragment) {
        console.log('Fragment HTML file not found')
        // load404();
        return
      }

      $(`.fragmentHolder[data-fragmentid="${fragment}"]`).each(function () {
        $(this).replaceWith(data)
      })
      window.router.updatePageLinks()

      const today = new Date()
      $('.currentYear').text(today.getFullYear())
      $('.currentVersion').text(config('version'))

      switch (fragment) {
        case 'headerNav':
          // inboxMessageHeader()
          break
      }
      renderTemplates()
    } catch (error) {
      console.log(error)
      // bugsnagClient.notify(error);
      // showFatalErrorPage(error);
    }
  }).fail(function (error) {
    console.log('Failed loading fragment')
    // bugsnagClient.notify(error);
    console.log(error)
  })
}

const loadPage = function (page, params) {
  $.get(`/pages/${page}.html`, function (data) {
    try {
      const isPage = data.startsWith('<!-- PAGE CONTENT-TAG_ID -->')
      const isStandalonePage = data.startsWith(
        '<!-- STANDALONE PAGE CONTENT-TAG_ID -->'
      )
      if (!isPage && !isStandalonePage) {
        console.log('Page HTML file not found')
        load404()
        return
      }

      // loads the page content into the dom
      if (isPage) {
        //    if (!$('#contentDiv').length) {
        //      console.log('Switching from standalone page, loading standard page core layout')
        //      $('#body').html('<script id="header_Holder">LoadFragment("header");</script><main id="main"></main><script id="footer_Holder">LoadFragment("footer");</script>')
        //    };
        $('#contentDiv').html(data)
      } else {
        $('body').html(data)
      }
      window.router.updatePageLinks()

      // updates any tags with the class CurrentYear with the YYYY year
      $('.CurrentYear').text(new Date().getFullYear())
      // scrolls back to the top of the window
      window.scrollTo(0, 0)

      renderTemplates()

      switch (page) {
        case 'index':
          console.log('Index page loaded')
          break
        case 'signin':
          console.log('Signin page loaded')
          signinPageLoad(params)
          break
      }
    } catch (error) {
      console.log(error)
      // showFatalErrorPage(error, 'PPERPGCA')
    }
  }).fail(function (error) {
    console.log(error)
    // showFatalErrorPage(error, 'PPERPGLD')
  })
}

export { loadPage, loadFragment, load404 }
