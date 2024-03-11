<script>
	import StudentHeroBanner from '$lib/components/StudentHeroBanner.svelte';
	import StudentContactInfo from '$lib/components/StudentContactInfo.svelte';

	export let data;
</script>

<div>
	<StudentHeroBanner student={data.student} />

	<div class="container grid grid-cols-3 gap-x-16 py-12 md:py-16 xl:gap-x-36">
		<div class="order-2 col-span-3 lg:order-1 lg:col-span-2">
			<h2 class="mb-5 font-normal">About</h2>
			<div>
				<p class="mb-5">
					Elena Brodeala holds a PhD in Law from the European University Institute in Florence,
					Italy and an LL.M. degree from Yale Law School. Currently, she is a post-doctoral
					researcher at the University of Zurich in Switzerland, where she investigates questions of
					reproductive autonomy in the case law of the European Court of Human Rights. For over
					three years, she was Adjunct Lecturer at Sciences Po in France where she taught courses on
					issues related to bioethics, gender studies, human rights and international law.
				</p>

				<p class="mb-5">
					Between 2018-2020, she was awarded a Robina Fellowship of Yale Law School to work at the
					European Court of Human Rights (where, among others, she clerked for Judge Keller of
					Switzerland) and at the Council of Europe’s Information Society Department in Strasbourg,
					France. She was also a coordinator of the Council of Europe project “Freedom of Expression
					and Freedom of the Media in South-East Europe (JUFREX 2)“ and an Odobleja Fellow at the
					New Europe College in Bucharest, Romania.
				</p>

				<p class="mb-5">
					Elena was a visiting researcher at the Kent Center for Law Gender and Sexuality in the UK
					(2018), at New Europe College in Bucharest, Romania (2016) and at the Central European
					University in Budapest, Hungary (2015). She spoke at various conferences in the fields of
					human rights, gender studies, public law and Europeanisation in several countries in
					Europe, in Canada and the US. She studied questions of law and/or gender studies at the
					University of Oslo, Norway, “Lucian Blaga” University of Sibiu, Romania and the University
					of Akureyri, Iceland. Furthermore, she is an alumna of Yale University’s Sherwin B. Nuland
					Summer Institute in Bioethics.
				</p>

				<p>
					She was one of the founding members and coordinators of the Constitutionalism and Politics
					Interdisciplinary Working Group at the EUI (2016-2017) and worked for Eurodesk Sweden
					(2012-2013) and a Romanian NGO in the field of preventing and combating violence against
					women (2011-2012).
				</p>
			</div>
		</div>

		<div class="order-1 col-span-3 mb-10 lg:order-2 lg:col-span-1 lg:mb-0">
			<StudentContactInfo />
		</div>
	</div>
</div>
