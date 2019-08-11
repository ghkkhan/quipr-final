function reactDone(){
    console.log("react is done loading");
    window.reactComponent.setGameName(localStorage.game_name);


}

var socket = returnSocket(0)

// Check for connection
if(socket !== undefined) {
    console.log('Connected to socket...');
    //connect to room.
    socket.on('connect', () => {
        socket.emit('join_room', {
            room_name: localStorage.game_name
        })
    })
    // Handle displaying prompt for voting
    socket.on('show_prompt', (data) => {
        window.reactComponent.setQuestions(getPromptFromIdAndDisplay(data.prompt_id))
    });

    // Handle displaying response for voting
    socket.on('show_response1', (data) => {
        window.reactComponent.setResponses(data.response_txt, 1);
    });
    
    socket.on('show_response2', (data) => {
        window.reactComponent.setResponses(data.response_txt, 2);
    });

    // Handle second voting iteration. Need to clear the answers from the first round
    socket.on('clear_answer_txt', () => {
        window.reactComponent.setResponses("", 1);
        window.reactComponent.setResponses("", 2);
    });

    // Handle showing voting buttons
    socket.on('show_voting_buttons', () => {
        window.reactComponent.showButtons();
    });

    function votedLeft() {
        vote_p1_btn.addEventListener('click', () => {
            socket.emit('vote', {
                user_name: localStorage.user_name,
                vote_num: 1
            });
        });
    }
    function votedRight(){
        vote_p2_btn.addEventListener('click', () => {
            socket.emit('vote', {
                user_name: localStorage.user_name,
                vote_num: 2
            });
        });
    }

    //hides the two buttons...
    socket.on('hide_voting_buttons', () => {
        console.log('Ono. The buttons have gone into hiding.')
        window.reactComponent.hideButtons();
    });

    // Handling moving to scoreboard
    socket.on('move_to_scoreboard', () => {
        console.log('hi2');
        window.location.replace('./score/scoreboard.html');
    });

    // Handling showing who users voted for
    socket.on('show_users_votes', (data) => {
        var voters_names_for_p1 = data.votes_for_p1.map((user) => {
            return user.name
        })

        var voters_names_for_p2 = data.votes_for_p2.map((user) => {
            return user.name
        })
        //sends the arrays made above to the react file.
        window.reactComponent.setP1VoteArray(voters_names_for_p1);
        window.reactComponent.setPVoteArray(voters_names_for_p2);
    })
    
    socket.on('hide_users_votes', () => {
        //sends empty arrays to the p1 and p2 arrays in the react script.
        window.reactComponent.setP1VoteArray([""]);
        window.reactComponent.setPVoteArray([""]);
    })
}