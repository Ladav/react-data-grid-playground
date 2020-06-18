import React, { PropsWithChildren, useCallback } from 'react'
import CreateRow from './CreateRow'

interface Props {
  onAddCol?: (newColIndex: number) => void
  numberOfCols?: number
  addColButtonText?: string
  trigger: JSX.Element
  onAddRow: (newRowIndex: number) => void
  numberOfRows: number
  addRowButtonText?: string
  rowIdx: number
}

const Toolbar: React.FC<Props> = ({
  onAddCol,
  numberOfCols,
  addColButtonText,
  onAddRow,
  numberOfRows,
  addRowButtonText,
 rowIdx,
  trigger,
}) => {
  const addColHandler = useCallback(() => {
    if (numberOfCols) onAddCol?.(numberOfCols)
  }, [numberOfCols, onAddCol]);
  
  return (
    <div className="flex m-4 text-base">
      {onAddCol && (
        <div
          className="px-4 py-2 mx-2 bg-gray-200 rounded shadow cursor-pointer"
          onClick={addColHandler}
        >
          {addColButtonText || 'Add Col'}
        </div>
      )}
      <CreateRow
        trigger={trigger}
        addRow={onAddRow}
        rowIdx={rowIdx}
        numberOfRows={numberOfRows}
      />
      <div className="flex-1" />
    </div>
  )
}

export default Toolbar
