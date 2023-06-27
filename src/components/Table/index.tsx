import { DatePicker, Form, Input, Table, TableColumnProps } from 'antd'
import { ColumnsType } from 'antd/lib/table'
import { ReactElement, useCallback, useEffect, useMemo, useState } from 'react'

import './index.scss'

interface TableProps {
  api: (page: number, pageSize: number, search: any) => Promise<any>
  columns: TableColumnProps<any>[]
  className?: string
  refreshStamp?: number
  children?: ReactElement | null
  searchItems?: SearchItemProps[]
  scrollX?: number
  onParamsChange?: (params: any) => void
}

export enum SearchItemType {
  String = 'string',
  DateRange = 'dateRange'
}

export interface SearchItemProps {
  name: string
  label?: string
  type?: SearchItemType
}

const processColumns = (columns: ColumnsType<any>) => {
  columns.forEach((col) => {
    if (!col.render) {
      col.render = (value) => (value || value === 0 ? value : '-')
    }
  })

  return columns
}

export interface SearchOptionType {
  [key: string]: string | number | null
}

const MyTable = (props: TableProps) => {
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [total, setTotal] = useState(0)
  const [data, setData] = useState<any[]>()
  const [options, setOptions] = useState<SearchOptionType>({})

  const { api, searchItems, columns, className, refreshStamp, children, scrollX, onParamsChange } =
    props

  const FormItem = useCallback((item: SearchItemProps) => {
    switch (item.type) {
      case SearchItemType.DateRange: {
        return (
          <DatePicker.RangePicker
            onChange={(_, strs) => {
              console.log(strs)
              if (strs.length > 1) {
                setOptions((options) => ({
                  ...options,
                  [item.name + 'From']: strs[0] ? strs[0] + 'T00:00:00' : null,
                  [item.name + 'To']: strs[1] ? strs[1] + 'T23:59:59' : null
                }))
              } else if (strs.length > 0) {
                setOptions((options) => ({
                  ...options,
                  [item.name + 'From']: strs[0] ? strs[0] + 'T00:00:00' : null,
                  [item.name + 'To']: null
                }))
              } else {
                setOptions((options) => {
                  const _opts = { ...options }
                  delete _opts[item.name + 'From']
                  delete _opts[item.name + 'To']
                  return _opts
                })
              }
            }}
          />
        )
      }
      case SearchItemType.String:
      default: {
        return (
          <Input.Search
            allowClear
            onSearch={(value) => setOptions((options) => ({ ...options, [item.name]: value }))}
          />
        )
      }
    }
  }, [])

  const FormItems = useMemo<ReactElement[]>(() => {
    return (searchItems || []).map((item) => (
      <Form.Item label={item.label} key={item.name}>
        {FormItem(item)}
      </Form.Item>
    ))
  }, [searchItems])

  useEffect(() => {
    setLoading(true)

    if (onParamsChange) {
      onParamsChange({
        page,
        pageSize,
        ...options
      })
    }

    api(page, pageSize, options)
      .then((res: any) => {
        setPage(res.page)
        setData(res.list)
        setTotal(res.total)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [page, pageSize, refreshStamp, options])

  const scroll = useMemo(() => {
    const _scroll: { x?: number; y?: number } = {}
    if (total > 0) _scroll.y = 300
    if (scrollX) _scroll.x = scrollX
    return _scroll
  }, [scrollX, total])

  return (
    <div className={'table-page ' + (className || '')}>
      <Form layout="inline" className="table-header">
        {FormItems}
        <Form.Item>{children}</Form.Item>
      </Form>
      <Table
        rowKey="id"
        scroll={scroll}
        columns={processColumns(columns)}
        dataSource={data}
        loading={loading}
        pagination={
          total > 0
            ? {
                pageSize,
                current: page,
                total,
                showTotal: (total) => `共 ${total} 条`,
                showSizeChanger: true,
                onChange(page, pageSize) {
                  setPage(page)
                  setPageSize(pageSize)
                }
              }
            : false
        }></Table>
    </div>
  )
}

export default MyTable
