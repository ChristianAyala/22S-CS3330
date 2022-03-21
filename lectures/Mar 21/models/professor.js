class Professor {
    constructor(_DBQuery, _disconnect) {
        this.DBQuery = _DBQuery;
        this.disconnect = _disconnect;
    }

    close () {
        this.disconnect();
    }

    async fetchAllProfessors () {
        const results = await this.DBQuery('SELECT * FROM professor');
        return results;
    }

    async fetchProfessorsByName (name) {
        const results = await this.DBQuery('SELECT * FROM professor WHERE name = ?', [name]);
        return results;
    }
}

module.exports = Professor;