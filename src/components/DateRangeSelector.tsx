import React, {FC} from 'react'
import {ComponentColor, Dropdown, IconFont} from '@influxdata/clockface'
import {DateRangeOptions} from '../types'

interface Props {
  className?: string
  selectedDateRange: string
  handleSelectDateRange: (dateRange: string) => void
}
export const DateRangeSelector: FC<Props> = (props) => {
  const {className, selectedDateRange, handleSelectDateRange} = props

  return (
    <Dropdown
      className={className}
      button={(active, onClick) => (
        <Dropdown.Button
          active={active}
          onClick={onClick}
          icon={IconFont.Calendar}
          color={ComponentColor.Secondary}
          style={{
            textTransform: 'uppercase',
            letterSpacing: '0.07em',
          }}
        >
          {selectedDateRange}
        </Dropdown.Button>
      )}
      menu={(onCollapse) => (
        <Dropdown.Menu onCollapse={onCollapse}>
          <Dropdown.Item
            id={DateRangeOptions.Thirteen}
            key={DateRangeOptions.Thirteen}
            value={DateRangeOptions.Thirteen}
            onClick={handleSelectDateRange}
          >
            {DateRangeOptions.Thirteen}
          </Dropdown.Item>
          <Dropdown.Item
            id={DateRangeOptions.Fourteen}
            key={DateRangeOptions.Fourteen}
            value={DateRangeOptions.Fourteen}
            onClick={handleSelectDateRange}
          >
            {DateRangeOptions.Fourteen}
          </Dropdown.Item>
          <Dropdown.Item
            id={DateRangeOptions.Fifteen}
            key={DateRangeOptions.Fifteen}
            value={DateRangeOptions.Fifteen}
            onClick={handleSelectDateRange}
          >
            {DateRangeOptions.Fifteen}
          </Dropdown.Item>
          <Dropdown.Item
            id={DateRangeOptions.Sixteen}
            key={DateRangeOptions.Sixteen}
            value={DateRangeOptions.Sixteen}
            onClick={handleSelectDateRange}
          >
            {DateRangeOptions.Sixteen}
          </Dropdown.Item>
        </Dropdown.Menu>
      )}
    />
  )
}
