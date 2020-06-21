import React, {
  useState,
  useCallback,
  useEffect,
  useMemo,
  JSXElementConstructor,
  useRef,
} from 'react'
import ReactDataGrid, {
  Column,
  FormatterProps,
  EditorProps,
  Editor,
  UpdateActions,
  RowsUpdateEvent,
  HeaderRendererProps,
  Row as GridRow,
  RowRendererProps,
} from 'react-data-grid'
import useMeasure from 'react-use-measure'
import { range, debounce } from 'lodash-es'
import clsx from 'clsx'
import { Dropdown, Menu } from 'antd'

import Toolbar from './components/Toolbar'
import CreateRow from './components/CreateRow'
import { toArray } from 'antd/lib/form/util'

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

// row render (implement's context menu)
const RowRenderer: any = (props: any) => {
  // console.log(props)
  const [show, setShow] = useState(false)

  return (
    <React.Fragment>
      <GridRow
        {...props}
        className="rdg-cell-frozen rdg-cell-frozen-last"
        style={
          props.row.frozen || props.row.name === 'Item -100'
            ? { position: 'sticky', top: props.rowIdx * 0 + 35, zIndex: 99 }
            : {}
        }
        onContextMenu={() => {
          setShow(true)
        }}
      />
      {show ? (
        <div className="absolute z-10 w-48 px-4 py-3 bg-white rounded shadow-md">
          <div className="mb-3 text-xs font-medium tracking-wide text-gray-700 uppercase">
            Options
          </div>
          <button
            className={clsx('flex items-center focus:outline-none w-full')}
          >
            <CreateRow
              rowIdx={props.rowIdx}
              addRow={props.onAddRow}
              trigger={
                <div className="text-xs text-gray-800 cursor-pointer">
                  Add Row Above
                </div>
              }
            />
            <div className="flex-1" />
          </button>
        </div>
      ) : null}
    </React.Fragment>
  )
}

const INITIAL_COL_COUNT = 10
const INITIAL_ROW_COUNT = 10

const columns: Column<any>[] = [
  {
    key: 'name',
    name: 'Item Name',
    resizable: true,
    width: 160,
    frozen: true,
    summaryFormatter: ({ row }: any) => row.name,
  },
  ...range(INITIAL_COL_COUNT).map((val) => ({
    key: val.toString(),
    name: val.toString().padStart(2, '0'),
    maxWidth: 50,
    headerCellClass: 'font-medium text-gray-900 text-xs',
    cellClass: 'p-0',
    formatter: StatusFormatter,
    editable: true,
    editor: StatusEditor,
    summaryFormatter: (props: any) => {
      // console.log(props)
      return <p />
    },
  })),
]

const rows = range(INITIAL_ROW_COUNT).map((val) => ({
  name: `Item ${val + 1}`,
  ...range(INITIAL_COL_COUNT).reduce(
    (acc, col) => ({ ...acc, [col.toString()]: undefined }),
    {},
  ),
  frozen: false,
  id: val,
}))

const App = () => {
  const [ref, bounds] = useMeasure()

  const [rowsData, setRowsData] = useState(rows)

  const [colsData, setColsData] = useState(columns)

  const [testRow, setTestRow] = useState({ ...rows[0], name: 'Item -100' })

  const testRef = useRef(null)

  // console.log(colsData)

  const handleAddCol = useCallback(() => {
    console.log(colsData)

    const newCol = {
      key: (+colsData[1].key - 1).toString(),
      name: (+colsData[1].key - 1).toString().padStart(2, '0'),
      maxWidth: 50,
      headerCellClass: 'font-medium text-gray-900 text-xs',
      cellClass: 'p-0',
      formatter: StatusFormatter,
      editable: true,
      frozen: true,
      editor: StatusEditor,
    }

    const updatedColsData = [...colsData]

    // adding new column in updatedColsData
    updatedColsData.splice(1, 0, newCol)

    setColsData(updatedColsData)
  }, [colsData])

  const handleAddRow = useCallback(
    (index) => {
      // console.log(rowsData, index)
      const newRow = {
        name: `Item ${rowsData.length + 1}`,
        ...range(colsData.length - 1).reduce(
          (acc, col) => ({ ...acc, [col.toString()]: undefined }),
          {},
        ),
        frozen: index === 0,
        id: rowsData.length + 1,
      }

      const updatedRowsData = [...rowsData]

      updatedRowsData.splice(index, 0, newRow)

      setRowsData(updatedRowsData)
    },
    [rowsData, colsData],
  )

  // later replace the following any with row type/interface
  // const handleRowUpdate = useCallback(({ fromRow, toRow, updated, action }: RowsUpdateEvent<Partial<any>>): void => {
  const handleRowUpdate = useCallback(
    (props: RowsUpdateEvent<Partial<any>>): void => {
      console.log('[row Updated]', props)
      const { fromRow, toRow, updated, action } = props
      const updatedRows = [...rowsData]
      let start
      let end

      if (action === UpdateActions.COPY_PASTE) {
        start = toRow
        end = toRow
      } else {
        start = Math.min(fromRow, toRow)
        end = Math.max(fromRow, toRow)
      }

      for (let i = start; i <= end; i++) {
        updatedRows[i] = { ...updatedRows[i], ...updated }
      }

      setRowsData(updatedRows)
    },
    [rowsData],
  )

  // console.log('all done')

  return (
    <div className="w-screen h-screen overflow-hidden" ref={ref}>
      <Toolbar
        onAddCol={handleAddCol}
        onAddRow={handleAddRow}
        numberOfCols={colsData.length}
        numberOfRows={rowsData.length}
        rowIdx={0}
        trigger={
          <div className="px-4 py-2 mx-2 bg-gray-200 rounded shadow cursor-pointer">
            Add Row
          </div>
        }
      />
      <ReactDataGrid
      ref={testRef}
        enableCellDragAndDrop
        enableCellCopyPaste
        columns={colsData}
        rows={rowsData}
        height={bounds?.height - 80} // subtract toolbar height
        onRowsUpdate={handleRowUpdate}
        rowRenderer={(props) => (
          <RowRenderer
            {...props}
            onAddRow={(index: number) => handleAddRow(index)}
          />
        )}
        // summaryRows={rowsData.slice(0, 4)}
        onScroll={(props) => {
          // console.dir(props)

          console.dir(testRef)

          console.dir(props.currentTarget)
          console.log(props.currentTarget)

          // if(props.currentTarget) {
          //   props.currentTarget = [...(props.currentTarget.childNodes as any), <p>nasdfsafa</p>] as any
          // }

          let topVisibleRowIndex =
            props.currentTarget.childNodes[3].childNodes[0].textContent?.replace(
              'Item ',
              '',
            ) || 0

          if (+topVisibleRowIndex === -100) {
            topVisibleRowIndex =
              props.currentTarget.childNodes[4].childNodes[0].textContent?.replace(
                'Item ',
                '',
              ) || 0
          }

          console.log(topVisibleRowIndex)

          if (topVisibleRowIndex && +topVisibleRowIndex !== -100) {
            const timer = setTimeout(() => {
              setRowsData((prevRows) => {
                return prevRows.filter((row) => {
                  return row !== testRow
                })
              })

              // topVisibleRowIndex =
              //   props.currentTarget.childNodes[3].childNodes[0].textContent?.replace(
              //     'Item ',
              //     '',
              //   ) || 0

              setRowsData((prevRows) => [
                ...prevRows.slice(0, +topVisibleRowIndex),
                testRow,
                ...prevRows.slice(+topVisibleRowIndex),
              ])

              clearTimeout(timer)
            }, 300)
          }
        }}
      />

      <div className="fixed bottom-0 left-0 mb-8 ml-8">
        <CreateRow
          addRow={handleAddRow}
          numberOfRows={rowsData.length}
          rowIdx={rowsData.length}
          trigger={
            <div className="px-4 py-2 mx-2 bg-gray-200 rounded shadow cursor-pointer">
              Add Row
            </div>
          }
        />
      </div>
    </div>
  )
}

export default App
