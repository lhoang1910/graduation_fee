import { Button, FormControlLabel, Radio } from '@mui/material';
import { Flex, Input } from 'antd';
const { TextArea } = Input;
function Answer() {
  return (
    <div>
      <Flex justify='space-between'>
      <FormControlLabel value="female" control={<Radio color='success' />} label="Đáp án 1" />

        <Button variant='text' color='error'>Xóa đáp án</Button>
      </Flex>
    <TextArea  maxLength={100}       style={{
        height: 120,
      }}  placeholder="Nhập nội dung đáp án" />
    </div>
  );
}

export default Answer;
