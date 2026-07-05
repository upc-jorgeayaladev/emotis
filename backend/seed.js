require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI;

const userSchema = new mongoose.Schema({
  name: String, username: { type: String, unique: true }, email: { type: String, unique: true }, password: String,
  avatar: { secure_url: String, public_id: String }, cover: { secure_url: String, public_id: String },
  bio: String, followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], badges: [String],
  wishlist: [{ name: String, url: String }]
}, { timestamps: true });

const postSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, description: String,
  images: [{ secure_url: String, public_id: String }],
  reactions: { emotion: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], inspire: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], cry: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], want: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], perfect: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  occasion: String, giftProduct: String
}, { timestamps: true });

const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' }, content: String
}, { timestamps: true });

const calendarSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, title: String, date: Date,
  type: String, reminder: { type: Boolean, default: true }, reminderDays: { type: Number, default: 7 }
}, { timestamps: true });

const questionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, title: String, content: String, category: String,
  tags: [String], views: { type: Number, default: 0 }, solved: { type: Boolean, default: false },
  votes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  answers: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, content: String, votes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], createdAt: Date }]
}, { timestamps: true });

const blogPostSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, title: String, excerpt: String, content: String,
  cover: { secure_url: String, public_id: String }, category: String, readTime: String,
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], views: { type: Number, default: 0 },
  comments: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, content: String, likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], createdAt: Date }],
  featured: { type: Boolean, default: false }, tags: [String]
}, { timestamps: true });

const inspirationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, title: String, description: String,
  images: [{ secure_url: String, public_id: String }], category: String, tags: [String],
  reactions: { emotion: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], inspire: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], cry: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], want: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], perfect: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] },
  saves: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], views: { type: Number, default: 0 },
  comments: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, content: String, createdAt: Date }]
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
const Post = mongoose.model('Post', postSchema);
const Comment = mongoose.model('Comment', commentSchema);
const Calendar = mongoose.model('Calendar', calendarSchema);
const Question = mongoose.model('Question', questionSchema);
const BlogPost = mongoose.model('BlogPost', blogPostSchema);
const Inspiration = mongoose.model('Inspiration', inspirationSchema);

const img = (n) => `https://picsum.photos/seed/${n}/800/600`;

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Conectado a MongoDB');

    await Promise.all([User.deleteMany({}), Post.deleteMany({}), Comment.deleteMany({}), Calendar.deleteMany({}), Question.deleteMany({}), BlogPost.deleteMany({}), Inspiration.deleteMany({})]);
    console.log('🧹 Base de datos limpiada');

    const salt = await bcrypt.genSalt(10);
    const usersData = [
      { name: 'María García', username: 'maria_g', email: 'maria@emotis.com', password: await bcrypt.hash('maria123', salt), avatar: { secure_url: 'https://i.pravatar.cc/300?img=47' }, cover: { secure_url: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=1200' }, bio: 'Amante de los regalos personalizados 🎁 Mamá de dos hermosos niños. Cada detalle cuenta.', badges: ['🎂 Rey de los cumpleaños', '👩 Día de la Madre', '🎁 Maestro del regalo'], wishlist: [
        { name: 'Álbum de fotos familiar personalizado', url: '' }, { name: 'Taza con foto de mis hijos', url: '' }, { name: 'Reloj grabado con fecha de boda', url: '' }, { name: 'Cuadro canvas con nuestra mejor foto familiar', url: '' }, { name: 'Cojines bordados con nombres de los niños', url: '' }, { name: 'Kit de scrapbooking personalizado', url: '' }, { name: 'Marcador de libros grabado', url: '' }, { name: 'Camiseta familiar personalizada', url: '' }
      ] },
      { name: 'Carlos López', username: 'carlos_l', email: 'carlos@emotis.com', password: await bcrypt.hash('carlos123', salt), avatar: { secure_url: 'https://i.pravatar.cc/300?img=11' }, cover: { secure_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200' }, bio: 'Casado 10 años 💕 Cada aniversario busco superarme. Amante de las sorpresas románticas.', badges: ['💍 Romántico', '🎂 Rey de los cumpleaños'], wishlist: [
        { name: 'Botella de vino grabada con dedicatoria', url: '' }, { name: 'Experiencia de spa para dos', url: '' }, { name: 'Reloj de pulsera grabado', url: '' }, { name: 'Set de copas de cristal personalizadas', url: '' }, { name: 'Álbum de fotos de nuestros viajes', url: '' }, { name: 'Lámpara LED con foto familiar', url: '' }
      ] },
      { name: 'Ana Martínez', username: 'ana_m', email: 'ana@emotis.com', password: await bcrypt.hash('ana123456', salt), avatar: { secure_url: 'https://i.pravatar.cc/300?img=45' }, cover: { secure_url: 'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=1200' }, bio: 'Gerente de eventos corporativos 💼 Creo regalos memorables para empresas y clientes.', badges: ['💼 Corporativo'], wishlist: [
        { name: 'Set de oficina premium de cuero', url: '' }, { name: 'Agenda personalizada', url: '' }, { name: 'Termo corporativo grabado', url: '' }, { name: 'Paraguas personalizado con logo', url: '' }, { name: 'Estuche de viaje grabado', url: '' }, { name: 'Powerbank personalizado', url: '' }, { name: 'Mousepad XXL con diseño propio', url: '' }
      ] },
      { name: 'Sofía Vargas', username: 'sofia_v', email: 'sofia@emotis.com', password: await bcrypt.hash('sofia123', salt), avatar: { secure_url: 'https://i.pravatar.cc/300?img=44' }, cover: { secure_url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200' }, bio: 'Fotógrafa profesional y mamá primeriza 📸 Capturando los momentos más emotivos de la vida.', badges: ['👩 Día de la Madre', '🎄 Navidad', '🎓 Graduación'], wishlist: [
        { name: 'Cámara instantánea Fujifilm', url: '' }, { name: 'Marco de fotos digital con Wi-Fi', url: '' }, { name: 'Cuadro personalizado con foto familiar', url: '' }, { name: 'Álbum de bebé personalizado', url: '' }, { name: 'Lente 50mm f/1.8', url: '' }, { name: 'Funda de cámara grabada', url: '' }, { name: 'Photobook de 100 páginas', url: '' }, { name: 'Tripie compacto para viajes', url: '' }, { name: 'Kit de iluminación para retratos', url: '' }
      ] }
    ];

    const users = await User.insertMany(usersData);
    const [maria, carlos, ana, sofia] = users;

    await User.findByIdAndUpdate(maria._id, { following: [carlos._id, sofia._id], followers: [carlos._id, ana._id, sofia._id] });
    await User.findByIdAndUpdate(carlos._id, { following: [maria._id, ana._id], followers: [maria._id, sofia._id] });
    await User.findByIdAndUpdate(ana._id, { following: [maria._id, sofia._id], followers: [carlos._id, sofia._id] });
    await User.findByIdAndUpdate(sofia._id, { following: [maria._id, carlos._id, ana._id], followers: [maria._id, ana._id] });
    console.log('✅ 4 usuarios con wishlist completa');

    const postsData = [
      { user: maria._id, description: 'Mi mamá siempre quiso una taza con una foto de toda la familia. Hoy finalmente pude regalársela y lloró de emoción ❤️ No hay nada como verla sonreír así.', images: [{ secure_url: img('maria1') }], occasion: 'mothers_day', giftProduct: 'Taza personalizada', reactions: { emotion: [carlos._id, sofia._id], inspire: [ana._id], cry: [carlos._id], want: [], perfect: [ana._id, sofia._id] } },
      { user: carlos._id, description: 'Para nuestro aniversario #10 preparé una cena a la luz de las velas con música en vivo. Ella no esperaba nada de eso. Los 10 años juntos valen cada segundo 💕', images: [{ secure_url: img('carlos1') }], occasion: 'anniversary', giftProduct: 'Botella de vino grabada', reactions: { emotion: [maria._id, sofia._id, ana._id], inspire: [], cry: [maria._id, sofia._id], want: [], perfect: [ana._id] } },
      { user: ana._id, description: 'Organizamos un baby shower temático para mi mejor amiga. Cada detalle estaba personalizado: desde las invitaciones hasta los souvenirs. ¡Fue inolvidable! 🍼', images: [{ secure_url: img('ana1') }], occasion: 'other', giftProduct: 'Caja de recuerdos personalizada', reactions: { emotion: [maria._id, sofia._id], inspire: [carlos._id, sofia._id], cry: [], want: [maria._id], perfect: [carlos._id] } },
      { user: sofia._id, description: 'Mi hija cumplió su primer año y le hice un álbum con todas sus fotos mes a mes. Cada página tiene una dedicatoria especial. Es mi regalo más preciado 📸', images: [{ secure_url: img('sofia1') }], occasion: 'birthday', giftProduct: 'Álbum de fotos personalizado', reactions: { emotion: [maria._id, carlos._id, ana._id], inspire: [maria._id], cry: [carlos._id, ana._id], want: [], perfect: [maria._id, carlos._id] } },
      { user: maria._id, description: 'Navidad pasada hice una caja de sorpresa para cada miembro de la familia. Dentro había fotos impresas, cartas escritas a mano y pequeños obsequios. Todos lloraron 🎄', images: [{ secure_url: img('maria2') }], occasion: 'christmas', giftProduct: 'Caja Premium navideña', reactions: { emotion: [ana._id, sofia._id], inspire: [carlos._id], cry: [carlos._id, ana._id], want: [], perfect: [sofia._id] } },
      { user: carlos._id, description: 'Para el cumpleaños de mi papá le regalé una placa de madera grabada con una foto de cuando era niño y otra de ahora. No paró de abrazarme 🙏', images: [{ secure_url: img('carlos2') }], occasion: 'birthday', giftProduct: 'Placa conmemorativa', reactions: { emotion: [maria._id, ana._id], inspire: [sofia._id], cry: [maria._id], want: [], perfect: [ana._id, sofia._id] } },
      { user: sofia._id, description: 'Gracias a Emotis pude organizar la mejor graduación para mi hermana. El album de fotos que le hice con todos sus logros académicos la dejó sin palabras 🎓', images: [{ secure_url: img('sofia2') }], occasion: 'graduation', giftProduct: 'Álbum de graduación', reactions: { emotion: [maria._id, carlos._id, ana._id], inspire: [maria._id], cry: [carlos._id], want: [ana._id], perfect: [] } },
      { user: ana._id, description: 'Regalé un set de café personalizado a todo el equipo de mi oficina. Cada taza tenía el nombre y una frase motivacional. ¡El mejor regalo corporativo! ☕', images: [{ secure_url: img('ana2') }], occasion: 'corporate', giftProduct: 'Set de café personalizado', reactions: { emotion: [], inspire: [maria._id, carlos._id, sofia._id], cry: [], want: [maria._id, sofia._id], perfect: [carlos._id] } },
      { user: maria._id, description: 'Para San Valentín le hice a mi esposo un libro de recuerdos con todas nuestras fotos desde que nos conocimos. Cada página tiene una fecha y una dedicatoria 💝', images: [{ secure_url: img('maria3') }], occasion: 'valentines', giftProduct: 'Libro de recuerdos', reactions: { emotion: [carlos._id, sofia._id], inspire: [ana._id], cry: [carlos._id, ana._id, sofia._id], want: [], perfect: [] } },
      { user: carlos._id, description: 'Mi esposa siempre quería una experiencia de spa. Organicé un día completo de relajación para ella: masaje, facial, y cena romántica. Fue perfecto 💆‍♀️', images: [{ secure_url: img('carlos3') }], occasion: 'anniversary', giftProduct: 'Experiencia spa', reactions: { emotion: [maria._id, ana._id, sofia._id], inspire: [], cry: [maria._id], want: [ana._id, sofia._id], perfect: [] } },
      { user: sofia._id, description: 'Le regalé a mi esposo una lente nueva para su cámara. La sorpresa fue cuando vio que tenía una dedicatoria grabada en la montura. Amó cada detalle 📷', images: [{ secure_url: img('sofia3') }], occasion: 'birthday', giftProduct: 'Lente 50mm grabado', reactions: { emotion: [maria._id, carlos._id], inspire: [ana._id], cry: [], want: [maria._id, ana._id], perfect: [carlos._id] } },
      { user: maria._id, description: 'Mi hermana se graduó de medicina y le hice una caja con recuerdos de toda su carrera: fotos de la universidad, notas viejas, y un estetoscopio grabado 🎓', images: [{ secure_url: img('maria4') }], occasion: 'graduation', giftProduct: 'Caja de recuerdos', reactions: { emotion: [carlos._id, sofia._id, ana._id], inspire: [carlos._id], cry: [sofia._id, ana._id], want: [], perfect: [carlos._id] } },
      { user: ana._id, description: 'Para el Día del Padre regalé a cada empleado un reloj de escritorio personalizado con la fecha de su incorporación a la empresa. Todos se emocionaron 👔', images: [{ secure_url: img('ana3') }], occasion: 'other', giftProduct: 'Reloj de escritorio', reactions: { emotion: [maria._id], inspire: [carlos._id, sofia._id], cry: [], want: [maria._id, sofia._id], perfect: [carlos._id] } },
      { user: carlos._id, description: 'Sorprendí a mi mejor amigo en su despedida de soltero. Organice una cena sorpresa con todos sus amigos de la infancia. Lloró de la emoción 👫', images: [{ secure_url: img('carlos4') }], occasion: 'other', giftProduct: 'Experiencia gastronómica', reactions: { emotion: [maria._id, ana._id, sofia._id], inspire: [], cry: [maria._id, sofia._id], want: [], perfect: [ana._id] } },
      { user: sofia._id, description: 'Hice un photobook de mi primer año como mamá. Con fotos de cada mes, hospital, primeros pasos, primeras palabras. Es mi tesoro más valioso 👶', images: [{ secure_url: img('sofia4') }], occasion: 'birthday', giftProduct: 'Photobook bebé', reactions: { emotion: [maria._id, carlos._id, ana._id], inspire: [maria._id, ana._id], cry: [maria._id, carlos._id], want: [], perfect: [carlos._id] } },
      { user: maria._id, description: 'Regalé una manta personalizada con todas las fotos de nuestros vacaciones familiares. Cada vez que nos cubrimos con ella recordamos los mejores momentos 🏖️', images: [{ secure_url: img('maria5') }], occasion: 'other', giftProduct: 'Manta personalizada', reactions: { emotion: [carlos._id, sofia._id], inspire: [ana._id], cry: [], want: [ana._id, sofia._id], perfect: [carlos._id] } }
    ];

    const posts = await Post.insertMany(postsData);
    console.log(`✅ ${posts.length} posts creados`);

    const commentsData = [
      { user: carlos._id, post: posts[0]._id, content: '¡Qué hermoso gesto! Mi mamá también lloraría con algo así.' },
      { user: sofia._id, post: posts[0]._id, content: 'Las cosas personalizadas son las que más llegan al corazón.' },
      { user: maria._id, post: posts[1]._id, content: '¡Feliz aniversario! 10 años es mucho amor.' },
      { user: sofia._id, post: posts[1]._id, content: 'Carlos eres un romanticón. Tu esposa tiene mucha suerte.' },
      { user: maria._id, post: posts[2]._id, content: '¡Me encanta la idea! ¿Cómo hiciste las invitaciones?' },
      { user: carlos._id, post: posts[3]._id, content: 'El primer año es mágico. Qué bonito detalle el álbum.' },
      { user: ana._id, post: posts[3]._id, content: 'Las fotos mes a mes son un tesoro.' },
      { user: carlos._id, post: posts[4]._id, content: 'La Navidad con detalles personalizados es mejor.' },
      { user: sofia._id, post: posts[5]._id, content: 'Una placa grabada es un regalo atemporal.' },
      { user: maria._id, post: posts[7]._id, content: 'Los libros de recuerdos son mi debilidad.' },
      { user: sofia._id, post: posts[9]._id, content: 'Las experiencias juntos valen más que cualquier objeto.' },
      { user: ana._id, post: posts[10]._id, content: 'Los regalos de graduación emotivos son los mejores.' },
      { user: carlos._id, post: posts[11]._id, content: 'Los relojes personalizados son elegantes y significativos.' },
      { user: maria._id, post: posts[12]._id, content: 'Las despedidas de soltero sorpresa son inolvidables.' },
      { user: ana._id, post: posts[13]._id, content: 'Los photobooks de bebé son los regalos más tiernos.' },
      { user: sofia._id, post: posts[14]._id, content: 'Las mantas personalizadas son perfectas para el invierno.' },
    ];
    await Comment.insertMany(commentsData);
    console.log(`✅ ${commentsData.length} comentarios creados`);

    const now = new Date();
    const calendarData = [
      { user: maria._id, title: 'Cumpleaños de mamá', date: new Date(now.getFullYear(), now.getMonth() + 1, 15), type: 'birthday', reminder: true, reminderDays: 7 },
      { user: maria._id, title: 'Aniversario de bodas', date: new Date(now.getFullYear(), now.getMonth() + 2, 20), type: 'anniversary', reminder: true, reminderDays: 14 },
      { user: maria._id, title: 'Cumpleaños de Carlos', date: new Date(now.getFullYear(), now.getMonth() + 3, 12), type: 'birthday', reminder: true, reminderDays: 7 },
      { user: maria._id, title: 'Graduación de mi hermana', date: new Date(now.getFullYear(), now.getMonth() + 4, 28), type: 'other', reminder: true, reminderDays: 14 },
      { user: carlos._id, title: 'Cumpleaños de mi esposa', date: new Date(now.getFullYear(), now.getMonth() + 1, 8), type: 'birthday', reminder: true, reminderDays: 7 },
      { user: carlos._id, title: 'Día del Padre', date: new Date(now.getFullYear(), 5, 15), type: 'other', reminder: true, reminderDays: 7 },
      { user: carlos._id, title: 'Aniversario de noviazgo', date: new Date(now.getFullYear(), now.getMonth() + 3, 3), type: 'anniversary', reminder: true, reminderDays: 7 },
      { user: ana._id, title: 'Cumpleaños del CEO', date: new Date(now.getFullYear(), now.getMonth() + 1, 22), type: 'birthday', reminder: true, reminderDays: 14 },
      { user: ana._id, title: 'Evento corporativo anual', date: new Date(now.getFullYear(), now.getMonth() + 2, 10), type: 'other', reminder: true, reminderDays: 30 },
      { user: ana._id, title: 'Navidad corporativa', date: new Date(now.getFullYear(), 11, 18), type: 'other', reminder: true, reminderDays: 14 },
      { user: ana._id, title: 'Día del empleado', date: new Date(now.getFullYear(), now.getMonth() + 5, 20), type: 'other', reminder: true, reminderDays: 7 },
      { user: sofia._id, title: 'Primer cumpleaños de mi hija', date: new Date(now.getFullYear(), now.getMonth() + 1, 5), type: 'birthday', reminder: true, reminderDays: 7 },
      { user: sofia._id, title: 'Navidad', date: new Date(now.getFullYear(), 11, 25), type: 'other', reminder: true, reminderDays: 14 },
      { user: sofia._id, title: 'Día de la Madre', date: new Date(now.getFullYear(), 4, 11), type: 'other', reminder: true, reminderDays: 7 },
      { user: sofia._id, title: 'Bautizo de mi sobrino', date: new Date(now.getFullYear(), now.getMonth() + 2, 14), type: 'other', reminder: true, reminderDays: 7 },
    ];
    await Calendar.insertMany(calendarData);
    console.log(`✅ ${calendarData.length} eventos de calendario`);

    const questionsData = [
      { user: maria._id, title: '¿Qué regalo le harían a alguien que ama los gatos?', content: 'Mi mejor amiga es super fanática de los gatos y cumple años. Quiero algo personalizado. Presupuesto: S/. 150', category: 'birthday', tags: ['gatos', 'cumpleaños'], votes: [carlos._id, sofia._id, ana._id], views: 234, solved: true, answers: [
        { user: carlos._id, content: 'Una taza con fotos de sus gatos favoritos.', votes: [maria._id, sofia._id], createdAt: new Date() },
        { user: sofia._id, content: 'Un collar personalizado con su nombre.', votes: [maria._id], createdAt: new Date() },
        { user: ana._id, content: 'Una caja de sorpresa con snacks para gatos.', votes: [maria._id, carlos._id], createdAt: new Date() }
      ]},
      { user: carlos._id, title: 'Ideas para un aniversario de 10 años', content: 'Busco ideas creativas para sorprender a mi esposa. Algo significativo y emotivo.', category: 'anniversary', tags: ['aniversario', 'esposa'], votes: [maria._id, sofia._id, ana._id], views: 456, solved: false, answers: [
        { user: maria._id, content: 'Un álbum personalizado con fotos de cada año juntos.', votes: [carlos._id, sofia._id], createdAt: new Date() },
        { user: sofia._id, content: 'Una experiencia juntos: cena, spa, o viaje.', votes: [carlos._id, ana._id], createdAt: new Date() },
        { user: ana._id, content: 'Una caja de recuerdos con objetos de cada año.', votes: [carlos._id], createdAt: new Date() }
      ]},
      { user: ana._id, title: 'Regalo corporativo para clientes importantes', content: 'Nuestra empresa quiere reconocer a los clientes más importantes. Algo elegante pero emotivo.', category: 'corporate', tags: ['corporativo', 'clientes'], votes: [maria._id, carlos._id, sofia._id], views: 678, solved: true, answers: [
        { user: carlos._id, content: 'Cajas premium: botellas grabadas, agendas de cuero.', votes: [ana._id, maria._id], createdAt: new Date() },
        { user: sofia._id, content: 'Álbumes corporativos con mejores momentos.', votes: [ana._id], createdAt: new Date() }
      ]},
      { user: sofia._id, title: '¿Cómo organizar una fiesta sorpresa perfecta?', content: 'Quiero organizar una fiesta para mi amiga que cumple 30. ¿Consejos?', category: 'birthday', tags: ['fiesta', 'sorpresa'], votes: [maria._id, carlos._id], views: 189, solved: false, answers: [
        { user: maria._id, content: 'Define el presupuesto, luego fecha y lugar.', votes: [sofia._id, carlos._id], createdAt: new Date() },
        { user: ana._id, content: 'Invita solo a los más cercanos para mantener el secreto.', votes: [sofia._id], createdAt: new Date() }
      ]},
      { user: carlos._id, title: 'Regalo para papá que no sabe qué quiere', content: 'Mi papá siempre dice "no necesito nada". Quiero sorprenderlo.', category: 'birthday', tags: ['papá', 'difícil'], votes: [maria._id, ana._id, sofia._id], views: 345, solved: false, answers: [
        { user: ana._id, content: 'Algo personalizado: álbum familiar o algo de su hobby.', votes: [carlos._id, maria._id], createdAt: new Date() },
        { user: sofia._id, content: 'Una experiencia juntos: pesca, fútbol, o restaurante.', votes: [carlos._id], createdAt: new Date() },
        { user: maria._id, content: 'Una placa grabada con una foto familiar.', votes: [carlos._id, sofia._id], createdAt: new Date() }
      ]},
      { user: sofia._id, title: 'Ideas originales para Baby Shower', content: 'Quiero hacer un baby shower temático. ¿Ideas creativas y económicas?', category: 'other', tags: ['baby', 'fiesta'], votes: [maria._id, carlos._id, ana._id], views: 567, solved: true, answers: [
        { user: maria._id, content: 'Invitaciones en video personalizadas con fotos de la futura mamá.', votes: [sofia._id], createdAt: new Date() },
        { user: ana._id, content: 'Juegos interactivos con premios personalizados.', votes: [sofia._id, maria._id], createdAt: new Date() }
      ]},
      { user: ana._id, title: '¿Cómo elegir el regalo corporativo perfecto?', content: 'Necesito ideas para 50 empleados. Algo personalizado pero escalable.', category: 'corporate', tags: ['corporativo', 'empleados'], votes: [maria._id, carlos._id], views: 432, solved: false, answers: [
        { user: carlos._id, content: 'Tazas personalizadas con frases motivacionales.', votes: [ana._id], createdAt: new Date() },
        { user: sofia._id, content: 'Agendas con la marca de la empresa.', votes: [ana._id, carlos._id], createdAt: new Date() }
      ]},
      { user: maria._id, title: '¿Qué hacer para el primer aniversario de bodas?', content: 'Es nuestra primera boda y quiero que sea especial pero con presupuesto limitado.', category: 'anniversary', tags: ['aniversario', 'económico'], votes: [carlos._id, ana._id], views: 321, solved: false, answers: [
        { user: carlos._id, content: 'Cena casera con velas y música. Lo económico no es sinónimo de feo.', votes: [maria._id, sofia._id], createdAt: new Date() },
        { user: sofia._id, content: 'Un álbum DIY con vuestras fotos es muy emotivo.', votes: [maria._id], createdAt: new Date() }
      ]}
    ];
    await Question.insertMany(questionsData);
    console.log(`✅ ${questionsData.length} preguntas creadas`);

    const blogData = [
      { user: maria._id, title: 'Cómo sorprendí a mi familia en Navidad', excerpt: 'Organicé la Navidad perfecta con regalos personalizados...', content: 'Organicé la Navidad perfecta con regalos personalizados para cada miembro de la familia. Cada regalo tenía una historia detrás.\n\nPara mi mamá, una taza con una foto de toda la familia. Para mi papá, una placa grabada con su frase favorita. Para mis hijos, camisetas personalizadas con sus dibujos favoritos.\n\nLo más emotivo fue ver las caras de sorpresa cuando abrieron cada regalo. Las lágrimas de alegría de mi mamá no tienen precio.', category: 'stories', readTime: '5 min', featured: true, likes: [carlos._id, ana._id, sofia._id], tags: ['navidad', 'familia'], views: 892,
      comments: [
        { user: carlos._id, content: '¡Qué hermosa historia! La voy a copiar para mi familia.', likes: [maria._id], createdAt: new Date() },
        { user: sofia._id, content: 'Las fotos personalizadas son mi debilidad.', likes: [maria._id, carlos._id], createdAt: new Date() }
      ]},
      { user: sofia._id, title: 'El mejor regalo que recibí de mi mamá', excerpt: 'Un libro de historias infantiles personalizado...', content: 'Un libro de historias infantiles personalizado con todas las historias que mi mamá me contaba de niña. Cada capítulo era una aventura diferente.\n\nLo más emotivo fue la última página: "El héroe de todas estas historias siempre fuiste tú, y siempre lo serás." Lloré como no había llorado en años.\n\nEste regalo me enseñó que lo más valioso no tiene precio, tiene tiempo y amor.', category: 'stories', readTime: '4 min', featured: true, likes: [maria._id, carlos._id, ana._id], tags: ['mamá', 'emotivo'], views: 1245,
      comments: [
        { user: maria._id, content: 'Esto me hizo llorar. Las madres son únicas.', likes: [sofia._id], createdAt: new Date() },
        { user: ana._id, content: 'Los regalos hechos con amor son los que más duran.', likes: [sofia._id, maria._id], createdAt: new Date() }
      ]},
      { user: ana._id, title: 'Guía para regalos corporativos memorables', excerpt: 'Los regalos corporativos no tienen que ser genéricos...', content: 'Los regalos corporativos no tienen que ser genéricos. He aprendido que lo más importante es el toque personal.\n\n1. Conoce a tu cliente: investiga sus gustos.\n2. Personaliza siempre: un nombre o mensaje multiplica el valor.\n3. Cuenta una historia: el mejor regalo tiene historia.\n4. Presentación importa: empaque bonito = valor percibido.\n\nAplicando estos pasos, he logrado que nuestros clientes recuerden cada regalo.', category: 'tips', readTime: '6 min', featured: false, likes: [maria._id, carlos._id, sofia._id], tags: ['corporativo', 'guía'], views: 567,
      comments: [
        { user: carlos._id, content: 'Excelente guía. La voy a aplicar en mi empresa.', likes: [ana._id], createdAt: new Date() },
        { user: sofia._id, content: 'La presentación es clave. ¡Totalmente de acuerdo!', likes: [ana._id, carlos._id], createdAt: new Date() }
      ]},
      { user: carlos._id, title: '5 ideas románticas que nunca fallan', excerpt: 'Los detalles marcan la diferencia...', content: '1. Álbum de fotos personalizado: los mejores momentos juntos.\n2. Carta escrita a mano: en la era digital, invaluable.\n3. Cena a la luz de las velas: clásico pero efectivo.\n4. Experiencia juntos: spa, viaje, o clase nueva.\n5. Sorpresa matutina: desayuno con flores favoritas.\n\nLo importante no es cuánto gastas, sino cuánto piensas en la otra persona.', category: 'tips', readTime: '3 min', featured: false, likes: [maria._id, ana._id, sofia._id], tags: ['romántico', 'ideas'], views: 789,
      comments: [
        { user: maria._id, content: 'La carta escrita a mano es mi favorita.', likes: [carlos._id, sofia._id], createdAt: new Date() },
        { user: sofia._id, content: 'El desayuno sorpresa funciona siempre.', likes: [carlos._id], createdAt: new Date() }
      ]},
      { user: maria._id, title: 'Cómo crear un álbum familiar perfecto', excerpt: 'Paso a paso para organizar tus recuerdos...', content: 'Un álbum familiar es más que fotos: es una historia de amor.\n\nPaso 1: Recopila fotos de diferentes épocas.\nPaso 2: Organízalas cronológicamente.\nPaso 3: Escribe dedicatorias para cada una.\nPaso 4: Añade objetos pequeños: entradas de cine, flores prensadas.\nPaso 5: Dedica una página especial a los momentos más importantes.\n\nEl resultado es un tesoro que se pasará de generación en generación.', category: 'tutorials', readTime: '7 min', featured: false, likes: [carlos._id, ana._id, sofia._id], tags: ['álbum', 'tutorial'], views: 654,
      comments: [
        { user: sofia._id, content: '¡Excelente guía! La voy a seguir para el álbum de mi hija.', likes: [maria._id], createdAt: new Date() }
      ]},
      { user: sofia._id, title: 'Fotografía de bebé: captura los primeros meses', excerpt: 'Tips para fotografiar a los más pequeños...', content: 'Los primeros meses de un bebé son mágicos pero vuelan. Aquí van mis tips como fotógrafa:\n\n1. Luz natural: busca ventanas grandes.\n2. Ángulos bajos: fotografía a su nivel.\n3. Detalles: manos, pies, pestañas.\n4. Momentos espontáneos: sonrisas, bostezos.\n5. Usa una manta suave como fondo.\n\nNo necesitas equipo caro, solo paciencia y amor.', category: 'tips', readTime: '5 min', featured: false, likes: [maria._id, carlos._id, ana._id], tags: ['fotografía', 'bebé'], views: 876,
      comments: [
        { user: maria._id, content: 'Como mamá, esto me viene genial. ¡Gracias Sofía!', likes: [sofia._id], createdAt: new Date() },
        { user: ana._id, content: 'Las fotos de detalle son mi favoritas.', likes: [sofia._id, maria._id], createdAt: new Date() }
      ]}
    ];
    await BlogPost.insertMany(blogData);
    console.log(`✅ ${blogData.length} artículos de blog`);

    const inspirationData = [
      { user: maria._id, title: 'Taza familiar personalizada', description: 'Sorprendí a mi papá con una taza personalizada con una foto de toda la familia. ¡No podía dejar de sonreír!', images: [{ secure_url: img('insp1') }], category: 'birthday', tags: ['taza', 'familia'], reactions: { emotion: [carlos._id, sofia._id], inspire: [ana._id], cry: [], want: [sofia._id], perfect: [ana._id, carlos._id] }, saves: [sofia._id, ana._id], views: 345, comments: [
        { user: sofia._id, content: '¡Qué bonita! ¿Dónde la mandaste a hacer?', createdAt: new Date() },
        { user: carlos._id, content: 'Las tazas personalizadas son un clásico.', createdAt: new Date() }
      ]},
      { user: carlos._id, title: 'Botella de vino grabada', description: 'Regalo de aniversario: una botella de vino con dedicatoria grabada. Elegancia y sentimentalismo.', images: [{ secure_url: img('insp2') }], category: 'anniversary', tags: ['vino', 'elegante'], reactions: { emotion: [maria._id], inspire: [ana._id, sofia._id], cry: [], want: [maria._id, sofia._id], perfect: [ana._id] }, saves: [maria._id, ana._id], views: 567, comments: [
        { user: maria._id, content: '¡Me encanta la elegancia!', createdAt: new Date() }
      ]},
      { user: ana._id, title: 'Set de café corporativo', description: 'Cada taza personalizada con nombre y frase motivacional. El mejor regalo para el equipo.', images: [{ secure_url: img('insp3') }], category: 'corporate', tags: ['café', 'oficina'], reactions: { emotion: [], inspire: [maria._id, carlos._id, sofia._id], cry: [], want: [maria._id, sofia._id], perfect: [carlos._id] }, saves: [carlos._id], views: 890, comments: [
        { user: carlos._id, content: '¡Genial idea para mi oficina!', createdAt: new Date() }
      ]},
      { user: sofia._id, title: 'Álbum de fotos baby shower', description: 'Caja de recuerdos personalizada para el bebé con fotos, prendas y letras.', images: [{ secure_url: img('insp4') }], category: 'other', tags: ['baby', 'recuerdos'], reactions: { emotion: [maria._id, carlos._id, ana._id], inspire: [maria._id], cry: [carlos._id, ana._id], want: [maria._id], perfect: [carlos._id] }, saves: [maria._id, ana._id, carlos._id], views: 1123, comments: [
        { user: maria._id, content: '¡Qué idea tan hermosa!', createdAt: new Date() }
      ]},
      { user: maria._id, title: 'Cuadro familiar digital', description: 'Cuadro con todas las fotos familiares en collage. Perfecto para el living.', images: [{ secure_url: img('insp5') }], category: 'birthday', tags: ['cuadro', 'familia'], reactions: { emotion: [carlos._id, sofia._id], inspire: [ana._id], cry: [], want: [ana._id], perfect: [sofia._id] }, saves: [sofia._id], views: 432, comments: [] },
      { user: carlos._id, title: 'Cena romántica en casa', description: 'Transforma tu sala en restaurante: velas, música, y su plato favorito.', images: [{ secure_url: img('insp6') }], category: 'anniversary', tags: ['cena', 'romántico'], reactions: { emotion: [maria._id, sofia._id], inspire: [], cry: [maria._id], want: [ana._id, sofia._id], perfect: [ana._id] }, saves: [maria._id, ana._id, sofia._id], views: 678, comments: [
        { user: maria._id, content: 'Mi favorito. ¡Lo hago todo el tiempo!', createdAt: new Date() }
      ]},
      { user: sofia._id, title: 'Marco de fotos con luces LED', description: 'Marco con luces cálidas que crea ambiente acogedor. Perfecto para dormitorios.', images: [{ secure_url: img('insp7') }], category: 'other', tags: ['marco', 'decoración'], reactions: { emotion: [maria._id], inspire: [carlos._id, ana._id], cry: [], want: [maria._id, carlos._id, ana._id], perfect: [] }, saves: [maria._id, carlos._id], views: 543, comments: [
        { user: ana._id, content: '¡Quiero uno para mi oficina!', createdAt: new Date() }
      ]},
      { user: ana._id, title: 'Caja de bienvenida corporativa', description: 'Caja personalizada para nuevos empleados con items de la empresa y una carta de bienvenida.', images: [{ secure_url: img('insp8') }], category: 'corporate', tags: ['bienvenida', 'empresa'], reactions: { emotion: [], inspire: [maria._id, carlos._id, sofia._id], cry: [], want: [maria._id], perfect: [carlos._id, sofia._id] }, saves: [carlos._id], views: 456, comments: [] },
      { user: carlos._id, title: 'Reloj grabado con fecha especial', description: 'Reloj de mesa con la fecha de boda o aniversario grabada. Elegante y emotivo.', images: [{ secure_url: img('insp9') }], category: 'anniversary', tags: ['reloj', 'elegante'], reactions: { emotion: [maria._id, sofia._id], inspire: [ana._id], cry: [], want: [maria._id, ana._id, sofia._id], perfect: [] }, saves: [maria._id, sofia._id], views: 678, comments: [] },
      { user: sofia._id, title: 'Photobook de viaje', description: 'Álbum de fotos profesional con las mejores imágenes de tus vacaciones.', images: [{ secure_url: img('insp10') }], category: 'other', tags: ['viaje', 'fotos'], reactions: { emotion: [maria._id], inspire: [carlos._id, ana._id], cry: [], want: [maria._id, carlos._id], perfect: [ana._id] }, saves: [maria._id, carlos._id, ana._id], views: 789, comments: [
        { user: maria._id, content: '¡Hice uno de nuestro viaje a la playa y quedó increíble!', createdAt: new Date() }
      ]},
      { user: maria._id, title: 'Cojines personalizados con fotos', description: 'Cojines con fotos familiares perfectos para el sofá. Cómodos y emotivos.', images: [{ secure_url: img('insp11') }], category: 'other', tags: ['cojín', 'hogar'], reactions: { emotion: [carlos._id], inspire: [sofia._id, ana._id], cry: [], want: [sofia._id], perfect: [carlos._id, ana._id] }, saves: [sofia._id], views: 345, comments: [] }
    ];
    await Inspiration.insertMany(inspirationData);
    console.log(`✅ ${inspirationData.length} inspiraciones creadas`);

    console.log('\n🎉 ¡Base de datos poblada con datos realistas!');
    console.log('\n📧 Cuentas:');
    console.log('   María: maria@emotis.com / maria123');
    console.log('   Carlos: carlos@emotis.com / carlos123');
    console.log('   Ana: ana@emotis.com / ana123456');
    console.log('   Sofía: sofia@emotis.com / sofia123');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

seed();
