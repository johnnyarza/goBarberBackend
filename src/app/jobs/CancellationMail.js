import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale';
import Mail from '../../lib/Mail';

class CancellationMail {
  get key() {
    return 'CancellationMail';
  }

  async handle({ data }) {
    const { appointment } = data;
    await Mail.senddMail({
      to: `${appointment.provider.name} <${appointment.provider.email}`,
      subject: 'Agendamento cancelado',
      template: 'cancellation',
      context: {
        provider: appointment.provider.name,
        user: appointment.user.name,
        date: format(
          parseISO(appointment.date),
          "'dia' dd 'de' MMMM', às ' H:mm'h'",
          {
            locale: ptBR,
          }
        ),
      },
    });
    console.log({ message: 'A fila andou', appointment });
  }
}

export default new CancellationMail();
