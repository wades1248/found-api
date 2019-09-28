const ItemsService = {
    getAllItems(knex){
        return knex.select('*').from('items')
    },
    insertItem(knex, newItem){
        return knex
            .insert(newItem)
            .into('items')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    getByConfirmation(knex, confirmation){
        return knex
            .from('items')
            .select('*').where('confirmation', confirmation).first()
    },
    deleteItem(knex, confirmation){
        return knex('items')
            .where({confirmation})
            .delete()
    },
    updatePlayer(knex, confirmation, newItemFields){
        return knex('items')
        .where(({confirmation}))
        .update(newItemFields)
    }
}
module.exports = ItemsService