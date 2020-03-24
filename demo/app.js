import React, { Component } from 'react';
import SortableTree, { toggleExpandedForAll, addNodeUnderParent, removeNodeAtPath, onVisibilityToggle, getNodeKey, changeNodeAtPath, getNodeAtPath } from 'react-sortable-tree';
import CustomTheme from '../index';
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Input from '@material-ui/core/Input';
import './app.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchString: '',
      searchFocusIndex: 0,
      searchFoundCount: null,
      treeData: [
        { title: 'Sass', children: [{ title: 'Management' }] },
        { title: 'Alchemy'}
      ],
    };
    let { treeData } = this.state;
    this.updateTreeData = this.updateTreeData.bind(this);
    this.expandAll = this.expandAll.bind(this);
    this.collapseAll = this.collapseAll.bind(this);
  }

  updateTreeData(treeData) {
    this.setState({ treeData });
  }

  expand(expanded) {
    this.setState({
      treeData: toggleExpandedForAll({
        treeData: this.state.treeData,
        expanded,
      }),
    });
  }

  expandAll() {
    this.expand(true);
  }

  collapseAll() {
    this.expand(false);
  }

  onVisibility(treeData, node, expand) {
    onVisibilityToggle({ treeData: treeData, node: node, expand: expand })
  }



  render() {
    const {
      treeData,
      searchString,
      searchFocusIndex,
      searchFoundCount,
    } = this.state;

    const alertNodeInfo = ({ node, path, treeIndex }) => {
      const objectString = Object.keys(node)
        .map(k => (k === 'children' ? 'children: Array' : `${k}: '${node[k]}'`))
        .join(',\n   ');

      global.alert(
        'Info passed to the icon and button generators:\n\n' +
        `node: { \n   ${objectString} \n }, \n` +
        `path: [${path.join(', ')}], \n` +
        `treeIndex: ${treeIndex} `
      );
    };

    const selectPrevMatch = () =>
      this.setState({
        searchFocusIndex:
          searchFocusIndex !== null
            ? (searchFoundCount + searchFocusIndex - 1) % searchFoundCount
            : searchFoundCount - 1,
      });

    const selectNextMatch = () =>
      this.setState({
        searchFocusIndex:
          searchFocusIndex !== null
            ? (searchFocusIndex + 1) % searchFoundCount
            : 0,
      });

    const addNode = (data) => {
      let parentNode = getNodeAtPath({
        treeData: this.state.treeData,
        path: data.path,
        getNodeKey: ({ treeIndex }) => treeIndex,
        ignoreCollapsed: true
      });
      let getNodeKey = ({ node: object, treeIndex: number }) => {
        return number;
      };
      let parentKey = getNodeKey(parentNode);
      if (parentKey == -1) {
        parentKey = null;
      }
      let newTree = addNodeUnderParent({
        treeData: this.state.treeData,
        newNode: { title: '' },
        expandParent: true,
        parentKey: parentKey,
        getNodeKey: ({ treeIndex }) => treeIndex
      });
      this.setState(state => ({
        treeData: newTree.treeData,
      }));
      console.log(data);
    }
    const deleteNode = (data) => {
      console.log('delete: ', data);
      let { node, treeIndex, path } = data;
      this.setState({
        treeData: removeNodeAtPath({
          treeData: this.state.treeData,
          path: path,   // You can use path from here
          getNodeKey: ({ node: TreeNode, treeIndex: number }) => {
            // console.log(number);
            return number;
          },
          ignoreCollapsed: true,
        })
      })
    }

    return (
      <div
        style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}
      >
        <div style={{ flex: '0 0 auto', padding: '0 15px' }}>
          <h3>Full Node Drag Theme</h3>
          <button onClick={this.expandAll}>Expand All</button>
          <button onClick={this.collapseAll}>Collapse All</button>
        </div>

        <div style={{ flex: '1 0 50%', padding: '0 0 0 15px' }}>
          <SortableTree
            theme={CustomTheme}
            treeData={this.state.treeData}
            onChange={this.updateTreeData}
            searchQuery={searchString}
            searchFocusOffset={searchFocusIndex}
            style={{ width: '600px' }}
            rowHeight={45}
            searchFinishCallback={matches =>
              this.setState({
                searchFoundCount: matches.length,
                searchFocusIndex:
                  matches.length > 0 ? searchFocusIndex % matches.length : 0,
              })
            }
            canDrag={({ node }) => !node.dragDisabled}
            generateNodeProps={row => ({
              title: row.node.needsTitle ? (
                row.node.title
              ) : (
                  <form
                    onSubmit={event => {
                      event.preventDefault();
                      const { needsTitle, ...nodeWithoutNeedsTitle } = row.node;
                      this.setState(state => ({
                        treeData: changeNodeAtPath({
                          treeData: state.treeData,
                          path: row.path,
                          getNodeKey: ({ treeIndex }) => treeIndex,
                          newNode: nodeWithoutNeedsTitle,
                        }),
                      }));
                    }}
                  >
                    <Input

                      placeholder="Nueva unidad"
                      value={row.node.title}
                      onChange={event => {
                        const title = event.target.value;

                        this.setState(state => ({
                          treeData: changeNodeAtPath({
                            treeData: state.treeData,
                            path: row.path,
                            getNodeKey: ({ treeIndex }) => treeIndex,
                            newNode: { ...row.node, title },
                          }),
                        }));
                      }}
                    />
                  </form>
                ),
              buttons: [
                <IconButton onClick={() => addNode(row)}>
                  <AddIcon fontSize="large" />
                </IconButton>,
                <IconButton onClick={() => deleteNode(row)}>
                  <DeleteIcon fontSize="large" />
                </IconButton>
              ],
            })}
          />
        </div>
      </div>
    );
  }
}

export default App;
