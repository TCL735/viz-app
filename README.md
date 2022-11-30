# Viz App

A single page application that visualizes climate data taken from [Kaggle](https://www.kaggle.com/datasets/sumanthvrao/daily-climate-time-series-data). This data set includes daily measurements for mean temperature, humidity, wind speed, and mean presure. The data was lightly modifiied to remove extreme values, allowing the scale of the visualizations to be more visually presentable.

This is a front-end only application. The user can choose between a line graph, a scatter plot, or a simple table. Each type of visualization is put into a cell which is a movable and resizabe panel with a few buttons. The user may create multiple cells to display on the screen. As this application was purposely designed without any connection to backend services or infrastructure, network calls are only simulated. All data is loaded from imported modules and all storage is in-memory only using Redux.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app) and the TypeScript template.

## Major dependencies/packages

[Clockface](https://github.com/influxdata/clockface). The styling and almost all of the individual components such as buttons, dropdowns, panels, overlays, toggles, and icons come from this open source presentational component library.

[Giraffe](https://github.com/influxdata/giraffe). The visualizations including the line graph, scatter plot, and simple table. And the utility to perform the transformation of plain CSV from Kaggle into [Flux](https://www.influxdata.com/products/flux/) annotated CSV.

## Features

- Create visualizations with the "+ ADD VISUALIZAITON" button.

  - Each visualiation is put into a cell which is a resizable and movable panel with a name, a few buttons, and the visualization.
  - Naming the cell is optional but the name is set only once and cannot be changed even for blank names.
  - Choosing a visualization type is required. The choices are: line graph, scatter plot, and simple table.
  - Choosing a date range is optional and defaults to the entire data set. This selection can be changed again as many times as deisred.

- Delete a cell with the trash can button. Confirmation is required.

- Move a panel by clicking and holding the mouse button on any part of the cell that is not part of the visualization, and then dragging and dropping.

- Resize a panel clicking and dragging on the resizer handle in the bottom-right of any cell.

- Change the date range for the visualization in a cell by selecting from a dropdown menu.

- Adaptive Zoom feature. Drill down on a visualization by fetching (aka re-querying) for data using mouse click-drag movements. (_Fetching is simulated as mentioned above._)

  - Applies to only line graph and scatter plot.
  - A brief explanation on the zoom-in and zoom-out features from [Giraffe](https://github.com/influxdata/giraffe):

    - Zooming-in on the visualization:

      - Hover over the area bounded by the horizontal and vertical axes and the top and far right grid lines.
      - Inside this area, left-click and hold down the mouse button, then slide the mouse horizontally or vertically. Then release the mouse button.
      - During the drag, a shaded region will appear. This shaded region can be resized until the mouse button is released.
      - The visualization will re-render using the new limits for the two axes determined by the shaded region.
      - Zooming is progressive; additional zoom-ins will narrow the scope of the rendering.

    - Zooming-out or unzooming the visualization:
      - Double-click over any part of a line graph or scatter plot.
      - Resets the rendering of the visualization back to its first render with the selected date range.

  - Added by Viz App:
    - After zooming-in, instead of using fewer data points, the cell will fetch (aka re-query) again for data to give more details for the zoomed-in render.
    - The data fetching is simulated, as mentioned above. A loading spinner will appear to simulate a random short delay.
    - To see the difference, compare the renderings after zooming-in with the feature toggled on and toggled off.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
