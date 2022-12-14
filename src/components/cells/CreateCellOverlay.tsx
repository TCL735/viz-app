import React, {ChangeEvent, FC, useState} from 'react'
import {nanoid} from 'nanoid'
import {connect, ConnectedProps} from 'react-redux'
import {
  Button,
  ComponentColor,
  ComponentSize,
  ComponentStatus,
  Dropdown,
  Form,
  Grid,
  IconFont,
  Input,
  InputType,
  Overlay,
} from '@influxdata/clockface'
import {DateRangeSelector} from '../DateRangeSelector'
import {addCell, deleteCell} from './actions'
import {
  DEFAULT_CELL_LAYOUT_DIMENSIONS,
  INITIAL_DATE_RANGE,
  MAXIMUM_CELL_NAME_LENGTH,
} from '../../constants'
import {VisualizationTypes} from '../../types'

const OVERLAY_MAX_WIDTH = 600
const initialVisualizationType = 'Select the visualization (* required)'

type ReduxProps = ConnectedProps<typeof connector>
interface CreateCellOverlayProps {
  isOverlayVisible: boolean
  setIsOverlayVisible: (isVisible: boolean) => void
}

const CreateCellOverlayComponent: FC<CreateCellOverlayProps & ReduxProps> = (
  props
) => {
  const {addCell, isOverlayVisible, setIsOverlayVisible} = props

  const [cellName, setCellName] = useState<string>('')
  const [selectedVisualizationType, setSelectedVisualizationType] =
    useState<string>(initialVisualizationType)
  const [selectedDateRange, setSelectedDateRange] =
    useState<string>(INITIAL_DATE_RANGE)

  const isFormValid = selectedVisualizationType !== initialVisualizationType

  const closeAddCellOverlay = () => {
    setIsOverlayVisible(false)
  }

  const handleNameInput = (event: ChangeEvent<HTMLInputElement>) => {
    setCellName(event.target.value)
  }

  const handleSelectVisualization = (selection: string) => {
    setSelectedVisualizationType(selection)
  }

  const handleSelectDateRange = (selection: string) => {
    setSelectedDateRange(selection)
  }

  const handleAddVisualization = () => {
    addCell({
      id: nanoid(),
      name: cellName,
      type: selectedVisualizationType,
      dateRange: selectedDateRange,
      x: DEFAULT_CELL_LAYOUT_DIMENSIONS.x,
      y: DEFAULT_CELL_LAYOUT_DIMENSIONS.y,
      w: DEFAULT_CELL_LAYOUT_DIMENSIONS.w,
      h: DEFAULT_CELL_LAYOUT_DIMENSIONS.h,
      minW: DEFAULT_CELL_LAYOUT_DIMENSIONS.minW,
      minH: DEFAULT_CELL_LAYOUT_DIMENSIONS.minH,
    })
    closeAddCellOverlay()
    setSelectedDateRange(INITIAL_DATE_RANGE)
    setSelectedVisualizationType(initialVisualizationType)
    setCellName('')
  }

  return (
    <Overlay visible={isOverlayVisible} onEscape={closeAddCellOverlay}>
      <Overlay.Container maxWidth={OVERLAY_MAX_WIDTH}>
        <Overlay.Header
          title="Add a visualization"
          onDismiss={closeAddCellOverlay}
        />
        <Overlay.Body>
          <Grid>
            <Grid.Row className="create-cell-name">
              <Form.Element label="Name the Cell">
                <Input
                  type={InputType.Text}
                  value={cellName}
                  maxLength={MAXIMUM_CELL_NAME_LENGTH}
                  name="name"
                  onChange={handleNameInput}
                  placeholder="Name this cell"
                  titleText="Add a cell with a visualization"
                  size={ComponentSize.Medium}
                  autoFocus={true}
                />
              </Form.Element>
            </Grid.Row>
            <Grid.Row className="create-cell-visualization-type">
              <Dropdown
                button={(active, onClick) => (
                  <Dropdown.Button
                    active={active}
                    onClick={onClick}
                    icon={IconFont.GraphLine_New}
                    color={ComponentColor.Primary}
                    style={{
                      textTransform: 'uppercase',
                      letterSpacing: '0.07em',
                    }}
                  >
                    {selectedVisualizationType}
                  </Dropdown.Button>
                )}
                menu={(onCollapse) => (
                  <Dropdown.Menu onCollapse={onCollapse}>
                    <Dropdown.Item
                      id={VisualizationTypes.Line}
                      key={VisualizationTypes.Line}
                      value={VisualizationTypes.Line}
                      onClick={handleSelectVisualization}
                    >
                      {VisualizationTypes.Line}
                    </Dropdown.Item>
                    <Dropdown.Item
                      id={VisualizationTypes.Scatter}
                      key={VisualizationTypes.Scatter}
                      value={VisualizationTypes.Scatter}
                      onClick={handleSelectVisualization}
                    >
                      {VisualizationTypes.Scatter}
                    </Dropdown.Item>
                    <Dropdown.Item
                      id={VisualizationTypes.SimpleTable}
                      key={VisualizationTypes.SimpleTable}
                      value={VisualizationTypes.SimpleTable}
                      onClick={handleSelectVisualization}
                    >
                      {VisualizationTypes.SimpleTable}
                    </Dropdown.Item>
                  </Dropdown.Menu>
                )}
              />
            </Grid.Row>
            <Grid.Row className="create-cell-date-range">
              <DateRangeSelector
                selectedDateRange={selectedDateRange}
                handleSelectDateRange={handleSelectDateRange}
              />
            </Grid.Row>
          </Grid>
        </Overlay.Body>
        <Overlay.Footer>
          <Button
            color={ComponentColor.Tertiary}
            onClick={closeAddCellOverlay}
            tabIndex={1}
            text="Cancel"
          />
          <Button
            color={ComponentColor.Primary}
            onClick={handleAddVisualization}
            status={
              isFormValid ? ComponentStatus.Valid : ComponentStatus.Disabled
            }
            tabIndex={0}
            text="Add Visualization"
          />
        </Overlay.Footer>
      </Overlay.Container>
    </Overlay>
  )
}

const mdtp = {
  addCell,
  deleteCell,
}

const connector = connect(null, mdtp)

export const CreateCellOverlay = connector(CreateCellOverlayComponent)
