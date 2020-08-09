import React from 'react';

class Home extends React.Component {

    state = {
        value: '',
        indexes: [],
        values: {}
    }

    renderIndexes = () => {
        fetch("/api/values/current")
            .then(response => response.json())
            .then(indexes => this.setState({ indexes }))
    }

    renderValues = () => {
        fetch("/api/values/all")
            .then(response => response.json())
            .then(values => {
                if (values) {
                    this.setState({ values })
                }
            })
    }

    componentDidMount() {
        this.renderIndexes();
        this.renderValues();
    }

    submitIndex = value => {
        fetch("/api/values", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "value": value
            })
        }).then(() => this.setState({
            ...this.state,
            value: ''
        }))
    }

    render() {
        return (
            <div>
                <h1 className="ui header">Fibonacci Calculator</h1>
                <div className="ui action input">
                    <input
                        type="text"
                        placeholder="Index..."
                        value={this.state.value}
                        onChange={e => this.setState({
                            value: e.target.value
                        })}
                    />
                    <button
                        className="ui button"
                        onClick={() => this.submitIndex(
                            this.state.value
                        )}
                    >
                        Search
                    </button>
                </div>
                <h2 className="ui header">Indexes I have seen: </h2>
                {this.state.indexes.join(", ")}
                <h2 className="ui header">Calculated Values: </h2>
                {
                    Object.keys(this.state.values).map(value => {
                        return (
                            <div key={value}>
                                For index {value}, I calculated {this.state.values[value]}
                            </div>
                        )
                    })
                }
            </div >
        );
    }
}

export default Home;
