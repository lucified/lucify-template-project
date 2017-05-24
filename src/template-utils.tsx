import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import * as Helmet from 'react-helmet';

export function DOCUMENT(headData: Helmet.HelmetProps, app?: JSX.Element) {
  ReactDOMServer.renderToString(<Helmet {...headData}/>);
  const renderedApp = {
    __html: app ? ReactDOMServer.renderToString(app) : '',
  };

  // TODO: remove the below once TS 2.3.3 has been released
  renderedApp; //tslint:disable-line

  const head = Helmet.rewind();
  const attrs = head.htmlAttributes.toComponent();
  return (
    <html {...attrs as any}>
      <head>
        {head.title.toComponent()}
        {head.meta.toComponent()}
        {head.link.toComponent()}
      </head>
      <body>
        <div id="content" dangerouslySetInnerHTML={renderedApp} />
        {head.script.toComponent()}
      </body>
    </html>
  );
}

export function getAssets(compilation: any, chunks: any) {
  // Use the configured public path or build a relative path
  let publicPath = compilation.options.output.publicPath;

  if (publicPath.length && publicPath.substr(-1, 1) !== '/') {
    publicPath += '/';
  }
  const assets = {
    // Will contain all js & css files by chunk
    chunks: {},
    // Will contain all js files
    js: [],
    // Will contain all css files
    css: [],
    // Will contain the html5 appcache manifest files if it exists
    manifest: Object.keys(compilation.assets).filter(f => f.match(/\.appcache$/))[0],
  } as any; // tslint:disable-line

  for (const chunk of chunks) {
    const chunkName = chunk.names ? chunk.names[0] : chunk.name;

    assets.chunks[chunkName] = {};

    // Prepend the public path to all chunk files
    const chunkFiles = [].concat(chunk.files).map(chunkFile => publicPath + chunkFile);

    // Webpack outputs an array for each chunk when using sourcemaps
    // But we need only the entry file
    const entry = chunkFiles[0];
    assets.chunks[chunkName].size = chunk.size;
    assets.chunks[chunkName].entry = entry;
    assets.chunks[chunkName].hash = chunk.hash;
    assets.js.push(entry);

    // Gather all css files
    const css = chunkFiles.filter(chunkFile => /.css($|\?)/.test(chunkFile));
    assets.chunks[chunkName].css = css;
    assets.css = assets.css.concat(css);
  }

  // Duplicate css assets can occur on occasion if more than one chunk
  // requires the same css.
  // assets.css = _.uniq(assets.css);

  return assets;
}

export function contextToHelmet(webpackCompilation: any): Helmet.HelmetProps {
  const assets = getAssets(webpackCompilation, webpackCompilation.chunks);
  return {
    htmlAttributes: { lang: 'en' },
    title: 'Visualization', // TODO
    link: [
      // TODO: { rel: 'canonical', href: 'https://www.lucify.com/something' },
      ...assets.css.map((href: string) => ({ rel: 'stylesheet', href })),
    ],
    script: assets.js.map((src: string) => ({ src, type: 'text/javascript' })),
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no' },
    ],
  };
}
