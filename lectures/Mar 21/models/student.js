class Student {
    constructor(_DBQuery, _disconnect) {
        this.DBQuery = _DBQuery;
        this.disconnect = _disconnect;
    }

    close () {
        this.disconnect();
    }

    async fetchAllStudents () {
        const results = await this.DBQuery('SELECT * FROM student');
        return results;
    }

    async fetchStudentsByName (name) {
        const results = await this.DBQuery('SELECT * FROM student WHERE name = ?', [name]);
        return results;
    }
}

module.exports = Student;