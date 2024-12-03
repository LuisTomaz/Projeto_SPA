import mongoose from 'mongoose';

// Interface para tipagem do TypeScript
export interface ITask {
  _id?: string;
  title: string;
  description: string;
  status: 'pendente' | 'em progresso' | 'concluída';
  priority: 'baixa' | 'média' | 'alta';
  dueDate: Date;
  // userId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Definição do Schema do Mongoose
const TaskSchema = new mongoose.Schema<ITask>({
  title: { 
    type: String, 
    required: [true, 'O título é obrigatório'],
    trim: true
  },
  description: { 
    type: String, 
    trim: true 
  },
  status: { 
    type: String, 
    enum: ['pendente', 'em progresso', 'concluída'],
    default: 'pendente'
  },
  priority: { 
    type: String, 
    enum: ['baixa', 'média', 'alta'],
    default: 'média'
  },
  // userId: { 
  //   type: String, 
  //   required: true 
  // },
  dueDate: { 
    type: Date, 
    required: [true, 'A data de conclusão é obrigatória']
  }
}, {
  timestamps: true
});

// Cria o modelo ou recupera o modelo existente para evitar re-compilação
export default mongoose.models.Task || mongoose.model<ITask>('Task', TaskSchema);