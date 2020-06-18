import React, { useCallback, cloneElement } from 'react'
import { add } from 'lodash-es'

interface Props {
  trigger: JSX.Element
  addRow: (newRowIndex: number) => void
  numberOfRows?: number
  rowIdx: number
}

const CreateRow: React.FC<Props> = ({
  trigger,
  addRow,
  numberOfRows,
  rowIdx,
}) => {

  const addRowHandler = useCallback(() => {
    if (typeof rowIdx === 'number') {
      addRow(rowIdx)
    }
  }, [addRow])

  return cloneElement(trigger, {
    onClick: addRowHandler,
  })
}

export default CreateRow
