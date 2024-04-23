// const http = require('node:http');
const express = require('express')
const {reader, writer} = require('./fs.service');
const app = express()

app.use(express.json());
app.use(express.urlencoded({extended: true}))

app.get('/', (req, res) => {
    res.send('hello world!')
})
app.get('/users', async (req, res) => {
   try {
       const users = await reader();
       res.json(users)
   }catch (e) {
       res.status(400).json(e.message)

   }
})
app.post('/users', async (req, res) => {
   try {
       const {name, email, password} = req.body;

       const users = await reader();

       const newUser = {id: users[users.length - 1].id + 1, name, email, password}
       users.push(newUser);
       await writer(users);

       res.status(201).json(newUser)
   }catch (e) {
       res.status(400).json(e.message)
   }
})
app.get('/users/:userId', async (req, res) => {
    try {
        const userId = Number(req.params.userId);
        const users = await reader();

        const findUser = users.find((user) => user.id === userId);
        if (!findUser) {
            throw new Error('User not found')
        }
        res.json(findUser)
    }catch (e) {
        res.status(400).json(e.message)
    }
})
app.put('/users/:userId', async (req, res) => {
    try {
        const {name, email, password} = req.body;
        const userId = Number(req.params.userId);
        const users = await reader();

        const index = users.findIndex((user) => user.id === userId);
        if (index === -1) {
            throw new Error('User not found')
        }

        users[index] = {...users[index], name, email, password};
        await writer(users);

        res.status(201).json(users[index]);
    }catch (e) {
        res.status(400).json(e.message);
    }
})
app.delete('/users/:userId', async (req, res) => {
    try {
        const userId = Number(req.params.userId);
        const users = await reader();

        const index = users.findIndex((user) => user.id === userId);
        if (index === -1) {
           throw new Error('User not found')
        }
        users.splice(index, 1);
        await writer(users);

        res.sendStatus(204)
    } catch (e) {
        res.status(400).json(e.message)
    }
})

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}/`)
})

// async function foo() {
//     try {
//         const server = await http.createServer((req, res) => {
//             if (req.method === 'GET' && req.url === '/users') {
//                 res.end(JSON.stringify(users));
//             }
//             if (req.method === 'POST' && req.url === '/users') {
//                 res.end(JSON.stringify(users));
//             }
//             res.end('Hello World!')
//         })
//         server.listen(5000, () => {
//             console.log('Server is running at http://localhost:5000/')
//         })
//     } catch (e) {
//         console.error(e)
//     }
// }
// void foo();