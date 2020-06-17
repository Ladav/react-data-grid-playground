import React, { useState, useCallback, useEffect } from 'react'
import ReactDataGrid, {
  Column,
  FormatterProps,
  EditorProps,
  Editor,
} from 'react-data-grid'
import useMeasure from 'react-use-measure'
import { range } from 'lodash-es'
import clsx from 'clsx'

const getColorFromValue = (value: string): string => {
  switch (value) {
    case 'completed': {
      return 'green-500'
    }

    case 'onTrack': {
      return 'blue-500'
    }

    case 'bursted': {
      return 'red-500'
    }

    case 'delayed': {
      return 'yellow-500'
    }

    default: {
      return 'gray-100'
    }
  }
}

const StatusFormatter: React.FC<FormatterProps> = ({ row, column }) => {
  const value = row[column.key]
  return (
    <div className={clsx('w-full h-full', `bg-${getColorFromValue(value)}`)} />
  )
}

class StatusEditor extends React.Component<EditorProps<string>>
  implements Editor<{ [key: string]: string }> {
  static STATUSES = [
    { value: 'onTrack', label: 'On Track' },
    { value: 'completed', label: 'Completed' },
    { value: 'delayed', label: 'Delayed' },
    { value: 'bursted', label: 'Burst' },
  ]

  state = { value: this.props.value }

  getValue = () => {
    return {
      [this.props.column.key]: this.state.value,
    }
  }

  getInputNode = () => {
    return null
  }

  handleStatusClick = (status: string) => () => {
    this.setState({ value: status }, () => {
      this.props.onCommit()
    })
  }

  render() {
    return (
      <div className="w-48 px-4 py-3 bg-white rounded shadow-md">
        <div className="mb-3 text-xs font-medium tracking-wide text-gray-700 uppercase">
          Select Project Status
        </div>
        {StatusEditor.STATUSES.map((status, index) => (
          <button
            key={status.value}
            className={clsx(
              'flex items-center focus:outline-none w-full',
              index !== StatusEditor.STATUSES.length - 1 ? 'mb-3' : undefined,
            )}
            onClick={this.handleStatusClick(status.value)}
          >
            <div
              className={clsx(
                'w-5 h-5 rounded-full mr-2',
                `bg-${getColorFromValue(status.value)}`,
              )}
            />
            <div className="text-xs text-gray-800">{status.label}</div>
            <div className="flex-1" />
            {this.state.value === status.value ? (
              <span className="text-gray-500">
                <svg
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  className="w-4 h-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            ) : null}
          </button>
        ))}
      </div>
    )
  }
}

// const columns: Column<any>[] = [
//   {
//     key: 'name',
//     name: 'Item Name',
//     resizable: true,
//     width: 160,
//   },
//   ...range(100).map((val) => ({
//     key: val.toString(),
//     name: val.toString().padStart(2, '0'),
//     maxWidth: 50,
//     headerCellClass: 'font-medium text-gray-900 text-xs',
//     cellClass: 'p-0',
//     formatter: StatusFormatter,
//     editable: true,
//     editor: StatusEditor,
//   })),
// ]

const rows = range(30).map((val) => ({
  name: `Item ${val + 1}`,
  ...range(100).reduce(
    (acc, col) => ({ ...acc, [col.toString()]: undefined }),
    {},
  ),
}))

const App = () => {
  const [ref, bounds] = useMeasure()

  const [rowsData, setRowsData] = useState(rows)

  const [colsData, setColsData] = useState<any>([])

  
  // let temp = 10
  // console.log(colsData, temp)
  
  const handleAddCol = useCallback(() => {
    // console.log(temp)
    console.log(colsData)
    
    setColsData((prevCols: any) => {
      const key = (prevCols.length - 1).toString()
      const name = (prevCols.length - 1).toString().padStart(2, '0')
      return [
        ...prevCols,
        {
          key,
          name,
          maxWidth: 50,
          headerCellClass: 'font-medium text-gray-900 text-xs',
          cellClass: 'p-0',
          formatter: StatusFormatter,
          editable: true,
          editor: StatusEditor,
        },
      ]
    })
  }, [])
  
  const handleAddRow = useCallback(() => {
    // console.log(rowsData)
    setRowsData((prevRows) => {
      let cols: any = []
      setColsData((prevCols: any) => {
        cols = prevCols
        return prevCols
      })
      
      const newRow = {
        name: `Item ${prevRows.length + 1}`,
        ...range(cols.length - 1).reduce(
          (acc, col) => ({ ...acc, [col.toString()]: undefined }),
          {},
          ),
        }
        console.log(prevRows, cols)
        return [...prevRows, newRow]
      })
    }, [])
    
    useEffect(() => {
      setColsData([{
        key: 'name',
        name: 'Item Name',
        resizable: true,
        width: 160,
        headerRenderer: () => {
          return (
            <div className="relative w-full h-full">
              <div>Item Name</div>
              <div className="absolute bottom-0 left-0 flex my-4">
                <div
                  className="flex items-center justify-center w-16 h-8 px-4 py-2 mx-1 font-normal bg-gray-200 rounded shadow cursor-pointer"
                  onClick={handleAddCol}
                >
                  Add Col
                </div>
  
                <div
                  className="flex items-center justify-center w-16 h-8 px-4 py-2 mx-1 font-normal bg-gray-200 rounded shadow cursor-pointer"
                  onClick={handleAddRow}
                >
                  Add Row
                </div>
              </div>
            </div>
          )
        },
      },
      ...range(10).map((val) => ({
        key: val.toString(),
        name: val.toString().padStart(2, '0'),
        maxWidth: 50,
        headerCellClass: 'font-medium text-gray-900 text-xs',
        cellClass: 'p-0',
        formatter: StatusFormatter,
        editable: true,
        editor: StatusEditor,
      })),
    ])
    }, [])
    // console.log(colsData, rowsData)
    
    return (
      <div className="w-screen h-screen overflow-hidden" ref={ref}>
      <ReactDataGrid
        headerRowHeight={180}
        columns={colsData}
        rows={rowsData}
        height={bounds?.height}
        onRowsUpdate={({ fromRow, updated = {} }) => {
          setRowsData((dataState) =>
            dataState.map((item, index) =>
              index !== fromRow ? item : { ...item, ...(updated) },
            ),
          )
        }}
      />
    </div>
  )
}

export default App
