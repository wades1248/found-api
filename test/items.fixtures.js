const makeItemsArray = function(){
    return(
        [
            {
                confirmation: '1',
                city: 'Saint Paul',
                business: 'test',
                phone: '555-555-5555',
                itemtype: 'Clothing',
                description: `red, hat`,
            },
            {   
                confirmation: '2',
                city: 'Saint Paul',
                business: 'test',
                phone: '555-555-5555',
                itemtype: 'Wallet',
                description: 'brown',
            },
            {
                confirmation: '3',
                city: 'Saint Paul',
                business: 'notest',
                phone: '555-555-5555',
                itemtype: 'Wallet',
                description: 'brown, leather'
            },
            {   
                confirmation: '4',
                city: 'Chicago',
                business: 'test',
                phone: '555-555-5555',
                itemtype: 'Clothing',
                description: 'red, hat'
            },
            {   
                confirmation: '5',
                city: 'Chicago',
                business: 'test',
                phone: '555-555-5555',
                itemtype: 'Wallet',
                description: 'brown'
            },
        ]
    )
}
module.exports= {makeItemsArray}