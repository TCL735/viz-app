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
          {Object.values(DateRangeOptions)
            .sort()
            .map((dateOption) => (
              <Dropdown.Item
                id={dateOption}
                key={dateOption}
                value={dateOption}
                onClick={handleSelectDateRange}
              >
                {dateOption}
              </Dropdown.Item>
            ))}
        </Dropdown.Menu>
      )}
    />
  )
}
