import React, { PropsWithChildren } from 'react'

interface Props {
  onAddCol?: () => void
  addColButtonText?: string
  onAddRow?: () => void
  addRowButtonText?: string
}

const Controls: React.FC<Props> = ({
  onAddCol,
  addColButtonText,
  onAddRow,
  addRowButtonText,
}) => {
  const addColHandler = () => {
      onAddCol?.()
  }

  const addRowHandler = () => {
      onAddRow?.()
  }

  return (
    <div className="flex items-baseline justify-between">
      {onAddCol && (
        <div
          className="flex items-center justify-center w-16 h-8 px-4 py-2 mx-2 font-normal bg-gray-200 rounded shadow cursor-pointer"
          onClick={addColHandler}
        >
          {addColButtonText || 'Add Col'}
        </div>
      )}
      {onAddRow && (
        <div
          className="flex items-center justify-center w-16 h-8 px-4 py-2 mx-2 font-normal bg-gray-200 rounded shadow cursor-pointer"
          onClick={addRowHandler}
        >
          {addRowButtonText || 'Add Row'}
        </div>
      )}
    </div>
  )
}

export default Controls
