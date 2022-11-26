import React, {CSSProperties, FC} from 'react'

interface PlotContainerProps {
  style?: CSSProperties
  children: React.ReactNode
}

export const PlotContainer: FC<PlotContainerProps> = (props) => {
  const {style = {}, children} = props

  const defaultPlotStyle = {
    width: 'calc(100vw - 100px)',
    height: 'calc(100vh - 125px)',
    margin: '50px',
  }

  return <div style={{...defaultPlotStyle, ...style}}>{children}</div>
}
