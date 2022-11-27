import React from 'react'

interface CellProps {
  children: React.ReactNode
}
export class Cell extends React.Component<CellProps> {
  render() {
    return (
      <div key="a" className="cell">
        {this.props.children}
      </div>
    )
  }
}
