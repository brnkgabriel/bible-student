let Error404 = {
  render: async () => {
    let view = /*html*/`
    <div id="message" class="-main">
      <h2>404</h2>
      <h1>Page Not Found</h1>
      <p>The specified file was not found on this website. Please check the URL for mistakes and try again</p>
      <h3>Or</h3>
      <p>Click the link below to return to the homepage</p>
      <a href="/#/" class="-homepage">Homepage</a>
    </div>
    `
    return view
  },
  after_render: async () => {}
}

export default Error404
