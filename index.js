//Requiring module
const { log } = require('console');
const fs = require('fs');

//Accessing arguments
const args = process.argv;

const currentWorkingDirectory = args[1].slice(0, -8);

if (fs.existsSync(currentWorkingDirectory + 'todo.txt') == false) {
    let createStream = fs.createWriteStream('todo.txt');
    createStream.end();
}

if (fs.existsSync(currentWorkingDirectory + 'done.txt') == false) {
    let createStream = fs.createWriteStream('done.txt');
    createStream.end();
}

const InfoFunction = () => {
    const UsageText = `
    Usage :-
    $ node index.js add "todo item" # Add a new todo
    $ node index.js ls              # Show remaining todos
    $ node index.js del NUMBER      # Delete a todo
    $ node index.js done NUMBER     # Complete a todo
    $ node index.js help            # Show usage
    $ node index.js report          # Statistics`;

    console.log(UsageText);
}

//List function

const listFunction = () => {
    // Create an array
    let data = [];

    //Read from todo.txt and convert it into String
    const fileData = fs.readFileSync(
      currentWorkingDirectory + 'todo.txt')
    .toString();

    //Split the string and store in array
    data = fileData.split('\n');

    //Filter the string for any empty lines in the file 
    let filterData = data.filter( function (value) {
        return value !== '';
    });

    if(filterData.length == 0) {
        console.log('There are no pending todos!');
    }

    for (let i =0; i< filterData.length; i++) {
        console.log((filterData.length - i) + '.'
        + filterData[i]);
    }
};

//Add Function

const addFunction = () => {
    // New todo string argument is stored 
    const newTask = args[3]; 
    if (newTask) {

        let data = [];

        const fileData = fs.readFileSync(currentWorkingDirectory + 'todo.txt').toString();

        fs.writeFile(
            currentWorkingDirectory + 'todo.txt',
            newTask + '\n' + fileData, 

            function (err) {
                
                if (err) throw err;

                console.log('Added todo: "' + newTask + '"');
            },
        );
    } else {
        // If argument was no passed 
        console.log('Error: Missing todo string. Nothing added!'); 
    }
};

// Delete function

const deleteFunction = () => {

    const deleteIndex = args[3];

    if (deleteIndex) {
        
        let data = [];

        const fileData = fs.readFileSync(currentWorkingDirectory + 'todo.txt').toString(); 

        data = fileData.split('\n'); 

        // Filter the data for any empty lines 
        let filterData = data.filter(function (value) { 
            return value !== '';  
        }); 

        if (deleteIndex > filterData.length || deleteIndex <= 0) { 
            console.log( 
              'Error: todo #' + deleteIndex  
                  + ' does not exist. Nothing deleted.', 
            );    
        } else {
            // Remove the task 
            filterData.splice(filterData.length - deleteIndex, 1);  
                
            // Join the array to form a string 
            const newData = filterData.join('\n');  
                
            // Write the new data back in file 
            fs.writeFile( 
                currentWorkingDirectory + 'todo.txt', 
                newData,  
                function (err) { 
                if (err) throw err; 
        
                // Logs the deleted index 
                console.log('Deleted todo #' + deleteIndex);  
                }, 
            ); 
        }  
    } else {
        console.log('Error: Missing NUMBER for deleting todo.');
    }
};

//Done Function

const doneFunction = () => { 

    // Store the index passed as argument 
    const doneIndex = args[3]; 
        
    // If argument is passed 
    if (doneIndex) { 
        
        // Empty array 
        let data = []; 
        
        // Create a new date object 
        let dateobj = new Date(); 
        
        // Convert it to string and slice only the 
        // date part, removing the time part 
        let dateString = dateobj.toISOString().substring(0, 10); 
        
        // Read the data from todo.txt 
        const fileData = fs 
        .readFileSync(currentWorkingDirectory + 'todo.txt') 
        .toString(); 
        
        // Read the data from done.txt 
        const doneData = fs 
        .readFileSync(currentWorkingDirectory + 'done.txt') 
        .toString(); 
            
        // Split the todo.txt data 
        data = fileData.split('\n'); 
        
        // Filter for any empty lines 
        let filterData = data.filter(function (value) { 
        return value !== ''; 
        }); 
        
        // If done index is greater than no. of task or <=0 
        if (doneIndex > filterData.length || doneIndex <= 0) { 
        console.log('Error: todo #'
            + doneIndex + ' does not exist.'); 
        } else { 
    
        // Delete the task from todo.txt 
        // data and store it 
        const deleted = filterData.splice( 
            filterData.length - doneIndex, 1); 
            
        // Join the array to create a string 
        const newData = filterData.join('\n'); 
            
        // Write back the data in todo.txt 
        fs.writeFile( 
            currentWorkingDirectory + 'todo.txt', 
            newData, 
            function (err) { 
            if (err) throw err; 
            }, 
        ); 
            
        // Write the stored task in done.txt 
        // along with date string 
        fs.writeFile( 
            currentWorkingDirectory + 'done.txt', 
            'x ' + dateString + ' ' + deleted 
            + '\n' + doneData, 
            function (err) { 
            if (err) throw err; 
            console.log('Marked todo #'
                + doneIndex + ' as done.'); 
            }, 
        ); 
        } 
    } else { 
    
        // If argument was not passed 
        console.log('Error: Missing NUMBER for'
            + ' marking todo as done.'); 
    } 
};
    

//Report Function

const reportFunction = () => { 

	// Create empty array for data of todo.txt 
	let todoData = []; 

	// Create empty array for data of done.txt 
	let doneData = []; 

	// Create a new date object 
	let dateobj = new Date(); 

	// Slice the date part 
	let dateString = dateobj.toISOString().substring(0, 10); 

	// Read data from both the files 
	const todo = fs.readFileSync(currentWorkingDirectory 
				+ 'todo.txt').toString(); 
	const done = fs.readFileSync(currentWorkingDirectory 
				+ 'done.txt').toString(); 

	// Split the data from both files 
	todoData = todo.split('\n'); 

	doneData = done.split('\n'); 
	let filterTodoData = todoData.filter(function(value) { 
		return value !== ''; 
	}); 

	let filterDoneData = doneData.filter(function(value) { 

		// Filter both the data for empty lines 
		return value !== ''; 
	}); 

	console.log( 
		dateString + 
		' ' + 
		'Pending : ' + 
		filterTodoData.length + 
		' Completed : ' + 
		filterDoneData.length, 
		// Log the stats calculated 
	); 
}; 


switch (args[2]) { 
    case 'add': { 
        addFunction(); 
        break; 
    } 
    
    case 'ls': { 
        listFunction(); 
        break; 
    } 
    
    case 'del': { 
        deleteFunction(); 
        break; 
    } 
        
    case 'done': { 
        doneFunction(); 
        break; 
    } 
        
    case 'help': { 
        InfoFunction(); 
        break; 
    } 
        
    case 'report': { 
        reportFunction(); 
        break; 
    } 
        
    default: { 
        InfoFunction(); 
        // We will display help when no 
        // argument is passed or invalid 
        // argument is passed 
    } 
}
    

    