import { Table, TableRow, TableCell, TableContainer } from '@material-ui/core';

function FileInfo(props) {
  const { fileInfo = {} } = props;

  return <TableContainer>
    <Table aria-label="file info table">
    <TableRow>
      <TableCell>name</TableCell>
      <TableCell align="right">{ fileInfo.filename || '-' }</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>width</TableCell>
      <TableCell align="right">{ `${fileInfo.width || '-'} px` }</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>height</TableCell>
      <TableCell align="right">{ `${fileInfo.height || '-'} px` }</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>size</TableCell>
      <TableCell align="right">{ `${fileInfo.size || '-'} b` }</TableCell>
    </TableRow>
  </Table>
  </TableContainer>
};

export default FileInfo;