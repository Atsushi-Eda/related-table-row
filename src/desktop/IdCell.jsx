import React from 'react';

const Cell = ({app, $id, rowIndex}) => {
  return <div><a target='_blank' href={`${location.origin}/k/${app}/show#record=${$id}`}>{$id}</a> - {rowIndex}</div>
}
export default Cell;