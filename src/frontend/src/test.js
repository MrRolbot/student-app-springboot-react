const onFinish = student => {
    setSubmitting(true)
    console.log(JSON.stringify(student, null, 2))
    addNewStudent(student)
        .then(() => {
            console.log("student added")
            onCLose();
            successNotification(
                "Student successfully added",
                `${student.name} was added to the system`
            )
            fetchStudents();
        }).catch(err => {
        console.log(err);
        err.response.json().then(res => {
            console.log(res);
            errorNotification(
                "There was an issue",
                `${res.message} [${res.status}] [${res.error}]`,
                "bottomLeft"
            )
        });
    }).finally(() => {
        setSubmitting(false);
    })
};