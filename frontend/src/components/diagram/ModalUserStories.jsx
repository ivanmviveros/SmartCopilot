import React, { useEffect, useState } from 'react'

function ModalUserStories(props) {
    const [userStories, setUserStories] = useState([]);
    const [selectedUserStory, setSelectedUserStory] = useState({
        id: '',
        name: '',
        actor: '',
        priority: '',
        points: '',
        purpose: '',
        restrictions: '',
        acceptanceCriteria: '',
        dependencies: []
    });

    const selectUserStory = (elementId) => {
        const userStory = userStories.find(element => elementId === element.id)
        setSelectedUserStory(userStory);
        const arrDependencies = props.createDependencies(userStory.element);
        setSelectedUserStory((prevState) => ({
            ...prevState,
            'dependencies': arrDependencies
        }))
    }

    useEffect(() => {
        if (props.modalUserStories._isShown === true) {
            const ListUserStories = props.jsonCreate(props.modeler).userStories;
            setUserStories(ListUserStories);
            setSelectedUserStory(ListUserStories[0]);
            const arrDependencies = props.createDependencies(ListUserStories[0].element);
            setSelectedUserStory((prevState) => ({
                ...prevState,
                'dependencies': arrDependencies
            }))
        }
    }, [props.modalUserStories]);

    return (
        <div className="modal fade" id="userStories" aria-labelledby="tittleUserStories" aria-hidden="true" ref={props.refModalUserStories}>
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xl">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="tittlePropertiesPanel">User Stories List</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body d-flex p-0">
                        <div className='w-50 p-3 table-responsive overflow-auto'>
                            <table className="table table-cursor table-striped table-hover mb-0">
                                <thead>
                                    <tr>
                                        <th className='col-2' scope="col">Id</th>
                                        <th>User Story</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        userStories.map((element, i) =>
                                            <tr key={i} onClick={() => selectUserStory(element.id)}>
                                                <th scope="row">{element.id}</th>
                                                <td>{element.name}</td>
                                            </tr>
                                        )
                                    }
                                </tbody>
                            </table>
                        </div>
                        <div className='w-50 p-3 border-start overflow-auto'>
                            <div className='rounded-2 bg-info bg-opacity-10 mb-2'>
                                <div className='bg-info bg-opacity-25 rounded-top'>
                                    <p className='text-center fw-bold mb-0'>User Story</p>
                                </div>
                                <div className='p-3'>
                                    <table className='table mb-0'>
                                        <tbody>
                                            <tr>
                                                <th className='w-15 text-center border-0'>{selectedUserStory.id}</th>
                                                <td className='ps-3 border-0'>{selectedUserStory.name}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className='rounded-2 bg-info bg-opacity-10 mb-2'>
                                <div className='bg-info bg-opacity-25 rounded-top'>
                                    <p className='text-center fw-bold mb-0'>Details</p>
                                </div>
                                <div className='p-3'>
                                    <table className='table mb-0'>
                                        <tbody>
                                            <tr>
                                                <th className="align-middle text-center w-20">Description</th>
                                                <td className='ps-3'>As a {selectedUserStory.actor.toLowerCase()}, I want to {selectedUserStory.name.toLowerCase()} {selectedUserStory.purpose !== '' ? `, so that ${selectedUserStory.purpose.toLowerCase()}` : ''}</td>
                                            </tr>
                                            <tr>
                                                <th className="align-middle text-center">Actor</th>
                                                <td className='ps-3'>{selectedUserStory.actor}</td>
                                            </tr>
                                            <tr>
                                                <th className="align-middle text-center">Project</th>
                                                <td className='ps-3'>{selectedUserStory.project}</td>
                                            </tr>
                                            <tr>
                                                <th className="align-middle text-center">Points</th>
                                                <td className='ps-3'>{selectedUserStory.points}</td>
                                            </tr>
                                            <tr>
                                                <th className="align-middle text-center">Priority</th>
                                                <td className='ps-3'>{selectedUserStory.priority}</td>
                                            </tr>
                                            {
                                                selectedUserStory.acceptanceCriteria !== '' ?
                                                    <tr>
                                                        <th className="align-middle text-center">Acceptance Criteria</th>
                                                        <td className='ps-3'>{selectedUserStory.acceptanceCriteria}</td>
                                                    </tr>
                                                    : ''
                                            }
                                            {
                                                selectedUserStory.restrictions !== '' ?
                                                    <tr>
                                                        <th className="align-middle text-center">Restrictions</th>
                                                        <td className='ps-3'>{selectedUserStory.restrictions}</td>
                                                    </tr>
                                                    : ''
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            {
                                selectedUserStory.dependencies.length > 0 ?
                                    <div className='rounded-2 bg-info bg-opacity-10'>
                                        <div className='bg-info bg-opacity-25 rounded-top'>
                                            <p className='text-center fw-bold mb-0'>Dependencies</p>
                                        </div>
                                        <div className='p-3'>
                                            <table className='table table-cursor table-striped table-hover mb-0'>
                                                <tbody>
                                                    {
                                                        selectedUserStory.dependencies.map((element, i) =>
                                                            <tr key={i} onClick={() => selectUserStory(element.id)}>
                                                                <th className='col-2' scope="row">{element.id}</th>
                                                                <td>{element.name}</td>
                                                            </tr>
                                                        )
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    : ''
                            }
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ModalUserStories;