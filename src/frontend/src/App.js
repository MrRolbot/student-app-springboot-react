import {useState, useEffect} from "react";

import {deleteStudent, getAllStudents} from "./client.js";

import {
    Layout,
    Menu,
    Breadcrumb,
    Table,
    Spin,
    Empty,
    Button,
    Badge,
    Tag,
    Avatar,
    Space,
    Popconfirm,
    Image
} from 'antd';

import {
    FileOutlined,
    TeamOutlined,
    UserOutlined,
    LoadingOutlined,
    UserAddOutlined,
    EditOutlined,
    DeleteOutlined,
    HomeOutlined,
    ReadOutlined,
} from '@ant-design/icons';

import StudentDrawerForm from "./StudentDrawerForm";

import './App.css';
import {errorNotification, successNotification} from "./Notification";

const {Header, Content, Footer, Sider} = Layout;
const {SubMenu} = Menu;

const TheAvatar = ({name}) => {
    let trim = name.trim();
    if (trim.length === 0) {
        return <Avatar icon={UserOutlined}/>
    }
    const split = trim.split(" ");
    if (split.length === 1) {
        return <Avatar>{name.charAt(0)}</Avatar>
    }
    return <Avatar>
        {`${name.charAt(0)} ${name.charAt(name.length-1)}`}
    </Avatar>
}

const removeStudent = (studentId, callback) => {
    deleteStudent(studentId).then(() => {
        successNotification(
            "Student deleted", `Student ID ${studentId} was deleted.`);
        callback();
    }).catch(err => {
        err.response.json().then(res => {
            console.log(res);
            errorNotification(
                "There was an issue",
                `${res.message} [${res.status}] [${res.error}]`
            )
        });
    })
}

const columns = fetchStudents => [
    {
        title: '',
        dataIndex: 'avatar',
        key: 'avatar',
        align: 'center',
        width: '100px',
        render: (text, student) =>
            <TheAvatar name={student['firstName']}/>,
        responsive: ['lg', 'md']
    },
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width: '100px',
        responsive: ['lg', 'md']
    },
    {
        title: 'First name',
        dataIndex: 'firstName',
        key: 'firstName',
        width: 150
    },
    {
        title: 'Last Name',
        dataIndex: 'lastName',
        key: 'lastName',
        width: 150
    },
    {
        title: 'Gender',
        dataIndex: 'gender',
        key: 'gender',
        width: '110px',
        responsive: ['lg', 'md']
    },
    {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
        width: 200
    },
    {
        title: 'Actions',
        dataIndex: 'actions',
        key: 'actions',
        render: (text, student) =>
            <Space>
                <Button shape="round" icon={<EditOutlined/>}>Edit</Button>
                <Popconfirm
                    placement='topRight'
                    title={`Are you sure you want to delete this student?`}
                    onConfirm={() => removeStudent(student.id, fetchStudents)}
                    okText='Yes'
                    cancelText='No'>
                    <Button shape="round" icon={<DeleteOutlined/>}>Delete</Button>
                </Popconfirm>
            </Space>,
        width: 150
    },
];

const antIcon = <LoadingOutlined style={{fontSize: 24}} spin/>;


function App() {
    const [students, setStudents] = useState([]);
    const [collapsed, setCollapsed] = useState(true);
    const [fetching, setFetching] = useState(true);
    const [showDrawer, setShowDrawer] = useState(false);

    const fetchStudents = () =>
        getAllStudents()
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setStudents(data);
                setFetching(false);
            }).catch(err => {
                console.log(err.response)
                err.response.json().then(res => {
                    console.log(res);
                    errorNotification("There was an issue",
                        `${res.message} [${res.status}] [${res.error}]`
                        )
                });
        }).finally(() => setFetching(false))

    useEffect(() => {
        console.log("component mounted");
        fetchStudents();
    }, []);

    const renderStudents = () => {
        if (fetching) {
            return <Spin indicator={antIcon}/>
        }
        if (students.length <= 0) {
            return <>
                <StudentDrawerForm
                    showDrawer={showDrawer}
                    setShowDrawer={setShowDrawer}
                    fetchStudents={fetchStudents}
                />
                <Button
                    className="add-btn-empty"
                    onClick={() => setShowDrawer(!showDrawer)}
                    type="primary" shape="round" icon={<UserAddOutlined/>} size="medium">
                    Add New Student
                </Button>
                <Empty/>
            </>;
        }
        return <>

            <StudentDrawerForm
                showDrawer={showDrawer}
                setShowDrawer={setShowDrawer}
                fetchStudents={fetchStudents}
            />

            <Table
                dataSource={students}
                columns={columns(fetchStudents)}
                bordered
                title={() => <>
                    <Tag color="blue">Number of students</Tag>
                    <Badge count={students.length} className="site-badge-count-4" />
                    <br/><br/>
                    <Button
                        className="add-btn"
                        onClick={() => setShowDrawer(!showDrawer)}
                        type="primary" shape="round" icon={<UserAddOutlined/>} size="medium">
                        Add New Student
                    </Button>
                </>}
                pagination={{pageSize: 20}}
                scroll={{y: 500}}
                rowKey={(student) => student.id}
            />
        </>
    }

    return <Layout style={{minHeight: '100vh'}}>
            <Sider
                breakpoint="lg"
                collapsible
                collapsedWidth="0"
                collapsed={collapsed}
                onCollapse={setCollapsed}>
                <div className="logo"/>
                <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
                    <Menu.Item key="1" icon={<HomeOutlined/>}>
                        Home
                    </Menu.Item>
                    <SubMenu key="sub1" icon={<ReadOutlined/>} title="Classes">
                        <Menu.Item key="3">Finance</Menu.Item>
                        <Menu.Item key="4">Business</Menu.Item>
                        <Menu.Item key="5">SCRUM</Menu.Item>
                    </SubMenu>
                    <SubMenu key="sub2" icon={<TeamOutlined/>} title="Teachers">
                        <Menu.Item key="6">Mr. Roldan</Menu.Item>
                        <Menu.Item key="8">Mr. Delgado</Menu.Item>
                    </SubMenu>
                    <Menu.Item key="9" icon={<FileOutlined/>}>
                        Files
                    </Menu.Item>
                </Menu>
            </Sider>
        <Layout className="site-layout">
            <Header className="site-layout-background header" style={{padding: 0}}><h1>Student Management</h1></Header>
            <Content style={{margin: '0 16px'}}>
                <Breadcrumb style={{margin: '25px 0'}}></Breadcrumb>
                <div className="site-layout-background" style={{padding: 24, minHeight: 360}}>
                    {renderStudents()}
                </div>
            </Content>
            <Footer style={{textAlign: 'center'}}>
                <Image
                    width={120}
                    src="https://user-images.githubusercontent.com/98711977/166860545-664cd095-24f1-41f2-b8ec-4960840dbf9f.png">

                </Image>
            </Footer>
        </Layout>
    </Layout>

}


export default App;
