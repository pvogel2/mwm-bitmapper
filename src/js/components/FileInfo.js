import { Table, TableBody, TableRow, TableCell, TableContainer } from '@material-ui/core';

function FileInfo(props) {
  const { fileInfo = {} } = props;
  console.log('>>>', fileInfo);

  return <TableContainer>
    <Table aria-label="file info table">
      <TableBody>
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
    <TableRow>
      <TableCell>channels</TableCell>
      <TableCell align="right">{ `${fileInfo.channels || '-'}` }</TableCell>
    </TableRow>
    </TableBody>
  </Table>
  </TableContainer>
};

export default FileInfo;