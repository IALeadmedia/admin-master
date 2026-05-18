import { toast } from "sonner"

interface IEntity {
    name: string
    plural: string
}

export class messageQueryFeedback {
    static deleteLoading(entity: IEntity, items: number) {
        return toast.loading(`Deletando ${items} ${items > 1 ? entity.plural : entity.name}...`)
    }

    static deleteError(entity: IEntity, id: string | number) {
        return toast.error(`Erro ao deletar ${entity.name} `, { id })
    }

    static deleteSuccess(entity: IEntity, items: number, id?: string | number) {
        return toast.success(`${items > 1 ? entity.plural : entity.name} deletado${items > 1 ? "s" : ""} com sucesso`, { id })
    }

    static updateLoading(name: string) {
        return toast.loading(`Atualizando ${name}...`)
    }

    static updateError(name: string, id: string | number) {
        return toast.error(`Erro ao atualizar ${name}`, { id })
    }

    static updateSuccess(name: string, id: string | number) {
        return toast.success(`${name} atualizado com sucesso`, { id })
    }

    static createLoading(name: string) {
        return toast.loading(`Criando ${name}...`)
    }

    static createError(name: string, id: string | number) {
        return toast.error(`Erro ao criar ${name}`, { id })
    }

    static createSuccess(name: string, id: string | number) {
        return toast.success(`${name} criado com sucesso`, { id })
    }

    static addLoading(name: string) {
        return toast.loading(`Adicionando ${name}...`)
    }

    static addError(name: string, id: string | number) {
        return toast.error(`Erro ao adicionar ${name}`, { id })
    }

    static addSuccess(name: string, id: string | number) {
        return toast.success(`${name} adicionado com sucesso`, { id })
    }
}