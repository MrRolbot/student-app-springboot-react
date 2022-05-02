import { Popconfirm, message } from 'antd';

function confirm(e) {
    console.log(e);
    message.success('Click on Yes');
}

function cancel(e) {
    console.log(e);
    message.error('Click on No');
}

export default () => (
    <Popconfirm
        title="Are you sure to delete this user?"
        onConfirm={confirm}
        onCancel={cancel}
        okText="Yes"
        cancelText="No"
    >
        <a href="#">Delete</a>
    </Popconfirm>
);