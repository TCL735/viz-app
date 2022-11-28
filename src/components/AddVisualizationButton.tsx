import React, {FC, useState} from 'react'
import {Button, ComponentColor, IconFont} from '@influxdata/clockface'
import {CreateCellOverlay} from './cells/CreateCellOverlay'

export const AddVisualizationButton: FC = () => {
  const [isOverlayVisible, setIsOverlayVisible] = useState<boolean>(false)

  return (
    <>
      <Button
        icon={IconFont.Plus_New}
        text="Add Visualization"
        onClick={() => setIsOverlayVisible(true)}
        color={ComponentColor.Primary}
        titleText="Add Visualization"
        testID="add-cell"
      />
      <CreateCellOverlay
        isOverlayVisible={isOverlayVisible}
        setIsOverlayVisible={setIsOverlayVisible}
      />
    </>
  )
}
