import React, { Component } from 'react';
//import PropTypes from 'prop-types';

import AppHeader from '../app-header/app-header';
import SearchPanel from '../search-panel/search-panel';
import TodoList from '../todo-list/todo-list';
import ItemStatusFilter from '../item-status-filter/item-status-filter';
import ItemAddForm from "../item-add-form/item-add-form";

export default class App extends Component {
    maxId = 100;
    state = {
        todoData: [
            this.createTodoItem('Drink Coffee'),
            this.createTodoItem('Make Awesome App'),
            this.createTodoItem('Have a lunch')
        ],
        term: ''
    };

    createTodoItem(label) {
        return {
            label,
            important: false,
            done: false,
            id: this.maxId++
        }
    }

    deleteItem = (id) => {
        this.setState( ({ todoData }) => {
            const idx = todoData.findIndex( (el) =>  el.id === id  );
            // нельзя изменять существующий state, поэтому
            const newArr = [
                ...todoData.slice(0, idx),
                ...todoData.slice(idx + 1)
            ];

            return {
                todoData: newArr
            }
        });
    }

    addItem = (text) => {
        const newItem = this.createTodoItem(text);

        // add element in array
        this.setState(({ todoData }) => {
            const newArr = [...todoData, newItem];

            return {
                todoData: newArr
            }

        });
    }

    toggleProperty (arr, id, propName) {
        // 1. update object
        const idx = arr.findIndex( (el) =>  el.id === id  );
        const oldItem = arr[idx];
        const newItem = {...oldItem, [propName]: !oldItem[propName] };

        // 2. construct new array
        return [
            ...arr.slice(0, idx),
            newItem,
            ...arr.slice(idx + 1)
        ];
    };

    onToggleImportant = (id) => {
        this.setState( ({ todoData }) => {
            return {
                todoData: this.toggleProperty(todoData, id, 'important')
            };
        });
    };

    onToggleDone = (id) => {
        this.setState(({ todoData }) => {
            return {
                todoData: this.toggleProperty(todoData, id, 'done')
            }
        });
    }

    onSearchChange = (term) => {
        this.setState({term});
    }
    search(items, term)  {
        if ( term.length === 0 ) {
            return items
        }
        return items.filter((item) => {
            const reg = new RegExp(`${term}`, 'i');
            return reg.test(item.label);
        });
    }


    render() {
        const { todoData, term } = this.state;
        const visibleItems = this.search(todoData, term);

        const doneCount = todoData
            .filter((el) => el.done === true )
            .length;
        const todoCount = todoData.length - doneCount;

        return (
            <div className="todo-app">
                <AppHeader toDo={ todoCount } done={ doneCount }/>
                <div className="top-panel d-flex">
                    <SearchPanel todos={ todoData }
                                 onSearchChange={this.onSearchChange}
                    />
                    <ItemStatusFilter />
                </div>
                <TodoList
                    todos={ visibleItems }
                    onDeleted={ this.deleteItem }
                    onToggleImportant={ this.onToggleImportant }
                    onToggleDone={ this.onToggleDone }
                />
                <ItemAddForm onItemAdded={ this.addItem }/>
            </div>
        );
    }
};

// 1. при вводе текста в поле поиска список автоматически фильтруется
// 2. фильтр и подсвечиванеи активного режима